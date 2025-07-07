import React from "react";
import "./LikeContainer.css";

import { BsHeart, BsHeartFill } from "react-icons/bs";

const LikeContainer = ({ photo, user, handleLike }) => {
  return (
    <div>
      <div className="like">
        {photo.likes && user && (
          <>
            {photo.likes.some(
              (like) => like === user.id || like.userId === user.id
            ) ? (
              <BsHeartFill></BsHeartFill>
            ) : (
              <BsHeart onClick={() => handleLike(photo)}></BsHeart>
            )}
            <p>{photo.likes.length} like(s)</p>
          </>
        )}
      </div>
    </div>
  );
};

export default LikeContainer;
