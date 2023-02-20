import { url } from "inspector";
import { useEffect, useState } from "react";
import { AuthType } from "../types/types";
import { urls } from "../utils/url";
import { toast, Toaster } from "react-hot-toast";

const Auth = () => {
  const [type, setType] = useState<AuthType>("login");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setRepeatPassword] = useState<string>("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(_validate());
  }, [name, email, password, passwordRepeat]);

  function _handleRegister(): void {
    if (valid) {
      try {
        fetch(urls.api + "/fighter/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })
          .then((resp) => resp.json())
          .then((data) => console.log(data));
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  }

  function _handleLogin(): void {
    if (valid) {
      try {
        fetch(urls.api + "/fighter/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then((resp) => resp.json())
          .then((data) => console.log(data));
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  }

  function _validate(): boolean {
    if (type === "login" && email && password) return true;

    if (
      type === "register" &&
      email &&
      password &&
      name &&
      passwordRepeat &&
      password === passwordRepeat
    )
      return true;

    return false;
  }

  if (type === "login")
    return (
      <form className="m-1 flex flex-col">
        <h1 className="text-lg font-bold">Register Account</h1>
        <label htmlFor="emailLogin">Email</label>
        <input
          type="email"
          name="email"
          id="emailLogin"
          className="border-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="passwordLogin">Password</label>
        <input
          type="password"
          name="password"
          id="passwordLogin"
          className="border-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="border-2"
          disabled={!valid}
          onClick={_handleLogin}
        >
          Login
        </button>
        <Toaster />
      </form>
    );

  if (type === "register")
    return (
      <form className="m-1 flex flex-col">
        <h1 className="text-lg font-bold">Register Account</h1>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="border-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="border-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="border-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="passwordRepeat">Repeat Password</label>
        <input
          type="password"
          name="passwordRepeat"
          id="passwordRepeat"
          className="border-2"
          value={passwordRepeat}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <button
          type="button"
          className="border-2"
          disabled={!valid}
          onClick={_handleRegister}
        >
          Register
        </button>
        <Toaster />
      </form>
    );
};

export default Auth;
