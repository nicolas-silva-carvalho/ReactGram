import React from "react";

import * as moment from "moment";
import "moment/locale/pt-br";

import { uploads } from "../utils/config";

import "./PhotoItem.css";
import { Link } from "react-router-dom";

const PhotoItem = ({ photo }) => {
  const formattedDate = moment(photo.createdAt).locale("pt-br").fromNow();
  return (
    <div className="photo-item">
      {photo.image && (
        <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
      )}
      <h2>{photo.title}</h2>
      <p className="photo-author">
        Publicada por:
        <Link to={`/users/${photo.user_id}`}> {photo.user_name}</Link>
        <span className="date">{formattedDate}</span>
      </p>
    </div>
  );
};

export default PhotoItem;
