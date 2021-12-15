const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema(
  {
    author: {
      type: ObjectId,
      ref: "User",
    },
    authorAvatar: {
      type: String,
      required: true
    },
    authorName: {
      type: String,
      required: true 
    },
    name: {
      type: String,
      trim: true,
      required: true,
      //maxlength: 32
    },   
    tags: {
      type: Array,
    },
    shippingPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "draft", "inactive"],
      default: "active",
      required: true
    },
    shippingTime: {
      type: String,
      enum: [ "1 Business Day", "1-3 Business Days","3-5 Business Days", "5+ Business Days"],
      default: "3-5 Business Days",
      required: true
    },
     slug: {
      type: String,
      unique: true,
      lowercase: true, 
      index: true,
    },
      reviews: [
    {
      type: ObjectId,
      ref: "ProductReview"
    }
  ],  
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    description: {
      type: String,
      required: true,
      //maxlength: 2000
    },
    summary : {
      type: String,
      // required: true
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },

    discount: {
      type: Number,
    },
    ratings: [
      {
        rating: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    brands: {
      type: ObjectId,
      ref: "Brand",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: [
      {
      url :{
        type: String
      },
      public_id: {
        type:String
      },
      },
    ],
  },
  { timestamps: true }
);

// productSchema
//   .virtual("categoryId")
//   .set(function (categoryId) {
//     this.addCategory(JSON.parse(categoryId));
//   })
//   .get(function () {
//     return this.category;
//   });


// productSchema.methods = {
//   addCategory(categories) {
//     for (let category of categories) {
//       this.category.push({ _id: category });
//     }
//   },
// };
productSchema.index({ name: "text"});
module.exports = mongoose.model("Product", productSchema);
