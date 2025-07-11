import "./Auth.css";
import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { register, reset } from "../../slices/authSlice";

import { Message } from "../../components/Message";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  function handleSubmit(e) {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    dispatch(register(user));
  }

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastra-se para ver as fotos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete="on"
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          autoComplete="on"
        />
        {!loading ? (
          <input type="submit" value="Cadastrar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}

        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Já tem conta ? <Link to="/login">Clique aqui.</Link>
      </p>
    </div>
  );
};

export default Register;
