import "./Home.css";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPhotos, like } from "../../slices/photoSlice";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

import { Link } from "react-router-dom";

import LikeContainer from "../../components/LikeContainer";
import PhotoItem from "../../components/PhotoItem";

const Home = () => {
  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);

  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  function handleLike(photo) {
    dispatch(like(photo.id));

    resetMessage();
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  console.log(photos);
  console.log(user);

  return (
    <div id="home">
      {photos &&
        photos.map((photo) => (
          <div key={photo.id}>
            <PhotoItem photo={photo} />
            <LikeContainer
              photo={photo}
              user={user}
              handleLike={handleLike}
            ></LikeContainer>
            <Link className="btn" to={`/photos/${photo.id}`}>
              Ver mais
            </Link>
          </div>
        ))}
      {photos?.length === 0 && (
        <h2 className="no-photos">
          Ainda não há fotos publicadas,
          <Link to={`/users/${user._id}`}> clique aqui</Link>
        </h2>
      )}
    </div>
  );
};

export default Home;
