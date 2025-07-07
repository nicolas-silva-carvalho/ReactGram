import React, { useEffect, useState } from "react";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";
import "./Photo.css";

import { uploads } from "../../utils/config";

import { Message } from "../../components/Message";
import { Link, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { getPhoto, like } from "../../slices/photoSlice";
import PhotoItem from "../../components/PhotoItem";
import LikeContainer from "../../components/LikeContainer";

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);

  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );

  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  const handleLike = () => {
    dispatch(like(photo.id));

    resetMessage();
  };

  if (loading) {
    <p>Carregando...</p>;
  }
  return (
    <div id="photo">
      <PhotoItem photo={photo}></PhotoItem>
      <LikeContainer
        photo={photo}
        user={user}
        handleLike={handleLike}
      ></LikeContainer>
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>
    </div>
  );
};

export default Photo;
