import "./Auth.css";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { login, reset } from "../../slices/authSlice";

import { Link } from "react-router-dom";
import { Message } from "../../components/Message";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  function handleSubmit(e) {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    dispatch(login(user));
    console.log("Enviando para login:", user);
  }

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div id="login">
      <h2>ReactGram</h2>
      <p className="subtitle">Faça o login para ver o que há de novo.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email || ""}
        />
        <input
          type="password"
          placeholder="Senha"
          autoComplete="on"
          onChange={(e) => setPassword(e.target.value)}
          value={password || ""}
        />
        {!loading ? (
          <input type="submit" value="Entrar" />
        ) : (
          <input type="submit" value="Aguarde..." disabled />
        )}

        {error && <Message msg={error} type="error" />}
      </form>
      <p>
        Não tem uma conta ? <Link to="/register">Clique aqui</Link>
      </p>
    </div>
  );
};

export default Login;
