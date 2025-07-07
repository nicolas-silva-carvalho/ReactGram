import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import EditProfile from "./pages/EditProfile/EditProfile";
import Profile from "./pages/Profile/Profile";
import Photo from "./pages/Photo/Photo";

function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar></Navbar>
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={auth ? <Home></Home> : <Navigate to="/login"></Navigate>}
            />
            <Route
              path="/profile"
              element={
                auth ? (
                  <EditProfile></EditProfile>
                ) : (
                  <Navigate to="/"></Navigate>
                )
              }
            />
            <Route
              path="/users/:id"
              element={
                auth ? <Profile></Profile> : <Navigate to="/"></Navigate>
              }
            />
            <Route
              path="/login"
              element={!auth ? <Login></Login> : <Navigate to="/"></Navigate>}
            />
            <Route
              path="/register"
              element={
                !auth ? <Register></Register> : <Navigate to="/"></Navigate>
              }
            />
            <Route
              path="/photos/:id"
              element={
                auth ? <Photo></Photo> : <Navigate to="/login"></Navigate>
              }
            />
          </Routes>
        </div>
        <Footer></Footer>
      </BrowserRouter>
    </div>
  );
}

export default App;
