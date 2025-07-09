import React from "react";
import "./LikeContainer.css";

import { BsHeart, BsHeartFill } from "react-icons/bs";

const LikeContainer = ({ photo, user, handleLike }) => {
  if (!photo.likes || !user) return null;

  const userId = user.id || user._id; // <- cobre ambos os casos

  const hasLiked = photo.likes.some((like) => {
    if (typeof like === "string") return like === userId;
    if (typeof like === "object") return like.userId === userId;
    return false;
  });

  return (
    <div className="like">
      {hasLiked ? (
        <BsHeartFill />
      ) : (
        <BsHeart onClick={() => handleLike(photo)} />
      )}
      <p>{photo.likes.length} like(s)</p>
    </div>
  );
};

export default LikeContainer;
