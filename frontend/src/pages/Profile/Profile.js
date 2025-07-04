import "./Profile.css";

import { uploads } from "../../utils/config";

import { Link } from "react-router-dom";
import { Message } from "../../components/Message";
import { BsFillEyeFill, BsPencilFill, BsXlg } from "react-icons/bs";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import { getUserDetails } from "../../slices/userSlice";

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);

  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id));
  }, [dispatch, id]);

  const submitHandle = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div>
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}></div>
          <h3>Compartilhe algum momento seu:</h3>
          <form onSubmit={submitHandle}>
            <label htmlFor="">
              <span>Título para a foto:</span>
              <input type="text" placeholder="Insira um título" />
            </label>
            <label htmlFor="">
              <span>Imagem:</span>
              <input type="file" />
            </label>
            <input type="submit" values="Postar" />
          </form>
        </>
      )}
    </div>
  );
};

export default Profile;
