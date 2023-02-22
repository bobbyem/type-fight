import { useEffect, useState } from "react";
import type { AuthType } from "../types/types";
import { urls } from "../utils/url";
import { useRouter } from "next/router";

interface Data {
  token?: string;
  insertedId?: string;
}

const Auth = () => {
  const router = useRouter();
  const [type, setType] = useState<AuthType>("register");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordRepeat, setRepeatPassword] = useState<string>("");
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (router.query.type) {
      const { type } = router.query;
      setType(type as AuthType);
    }
  }, [router.query]);

  useEffect(() => {
    setValid(_validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, passwordRepeat]);

  async function _handleRegister(): Promise<void> {
    if (valid) {
      try {
        await fetch(urls.api + "/fighter/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        })
          .then((resp) => resp.json())
          .then((data: Data) => {
            if (data.insertedId) {
              (async () =>
                router.push({
                  pathname: "/auth",
                  query: { type: "login" },
                }))().catch((error) => console.error(error));
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function _handleLogin(): Promise<void> {
    if (valid) {
      try {
        await fetch(urls.api + "/fighter/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then((resp) => resp.json())
          .then((data: Data) => {
            if (data.token) {
              sessionStorage.setItem("_tftoken", data.token);
              (async () => router.push("/fights"))().catch((error) =>
                console.error(error)
              );
            }
          });
      } catch (error) {
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
        <div className="flex">
          <h1 className="text-lg font-bold">Login</h1>
          <h1 className="text-lg font-bold">/</h1>
          <h1
            className="cursor-pointer text-lg font-bold text-fuchsia-400"
            onClick={() => setType("register")}
          >
            Register
          </h1>
        </div>
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
          onClick={() => {
            (async () => {
              await _handleLogin();
            })().catch((error) => console.error(error));
          }}
        >
          Login
        </button>
      </form>
    );

  if (type === "register")
    return (
      <form className="m-1 flex flex-col ">
        <div className="flex">
          <h1
            className="cursor-pointer text-lg font-bold text-fuchsia-400"
            onClick={() => setType("login")}
          >
            Login
          </h1>
          <h1 className="text-lg font-bold">/</h1>
          <h1 className="cursor-pointer text-lg font-bold ">Register</h1>
        </div>
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
          onClick={() => {
            (async () => _handleRegister())().catch((error) =>
              console.error(error)
            );
          }}
        >
          Register
        </button>
      </form>
    );
};

export default Auth;
