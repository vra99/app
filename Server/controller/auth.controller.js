const { User } = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); // this generates signed token
const expressJwt = require("express-jwt"); // for the authorization check
const { OAuth2Client } = require("google-auth-library");
const Session = require("../models/session");
const slugify = require("slugify");
const crypto = require("crypto");
const _ = require("lodash")

exports.authUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
};

exports.signup = (req, res) => {
  // console.log("req.body", req.body);
  // console.log("req.body", req.body);

  // const session = new Session(req.body);

  // session.save((err, data) => {
  //     if(err){
  //         return res.status(400).json({
  //             err: errorHandler(err)
  //         })
  //     }
  // });

  // req.body.sessionId = session._id;
  const { ...args } = req.body

  console.log(args.slug)

  if (req.body.role === 1) {
    args.slug = slugify(args.name) 
  }
  
      if (args.slug  === undefined || args.slug  === null) {
        console.log("null")
        args.slug= crypto.randomBytes(16).toString("hex");
      }

  const user = new User(args);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }  
    res.json({ user });
  });
};
exports.signin = (req, res) => {
  // const session = new Session(req.body);

  //find the user based inb email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist please sign up", //if the user is found make sure the email and password macth
      });
    }
    //create auth method in modals
    if (!user.authenticate(password)) {
      return res.status(401).json({ 
        error: "Email and password does not match",
      });
    }

    //generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    //reeturn response with user and token to front end client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  let { token } = req.headers;

  Session.findById(jwt.decode(token).session, (err, session) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }

    session.status = 0;

    session.save();

    res.clearCookie("t");

    res.json({ message: "Signout success" });
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.protect = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.profile.role)) {
      return res.status(403).json({
        msg: req.profile.role + " cant perform this operation",
      });
    }
    next();
  };
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Admin resourse! Access denied",
    });
  }
  next();
};      

//Google login Auth
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = (req, res) => {
  const { idToken } = req.body;
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "7d",
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role },
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password, slug:crypto.randomBytes(16).toString("hex")  });
            user.save((err, data) => {
              if (err) {
                console.log("ERROR GOOGLE LOGIN ON USER SAVE", err);
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              const { _id, email, name, role, avatar } = data;
              return res.json({
                token,
                user: { _id, email, name, role, avatar },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};
