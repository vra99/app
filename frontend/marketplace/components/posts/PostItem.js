import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import formatDate from '../../../utils/formatDate';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../../actions/postAction.js';
import { BiDislike, BiLike, BiX } from "react-icons/bi";
import { isAuthenticated } from '../../../actions/authAction';

const PostItem = ({
  addLike,
  removeLike,
  deletePost,
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date }, 
  showActions
}) => {
  const { token } = isAuthenticated();
  
  return (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={avatar} alt="" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{text}</p>
      <p className="post-date">Posted on {formatDate(date)}</p>

      {showActions && ( 
        <>
          <button
            onClick={() => addLike( _id, token)}
            type="button"
            className="btn btn-light"
          >
             < BiLike />{' '}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          <button
            onClick={() => removeLike(_id, token)}
            type="button"
            className="btn btn-light"
          >
            < BiDislike />
          </button>
          <Link to={`/posts/${_id}`} className="btn btn-primary">
            Comments{' '}
            {comments.length > 0 && (
              <span className="comment-count">{comments.length}</span>
            )}
          </Link>
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={() => deletePost(_id, token)}
              type="button"
              className="btn btn-danger"
            >
              <BiX />
            </button>
          )}
        </>
      )}
    </div>
  </div>
 );
}

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  showActions: PropTypes.bool
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);