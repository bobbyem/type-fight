import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { urls } from "../utils/url";

const Fight = () => {
  const router = useRouter();
  const { id } = router.query;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [correct, setCorrect] = useState<boolean>(false);
  const token = sessionStorage.getItem("_tftoken");
  useEffect(() => {
    const connect = io(urls.api) ?? null;
    //Trigger on connect
    connect.on("connect", () => {
      setSocket(connect);
      connect.emit("join_room", id, token);
    });

    //Trigger on disconnect
    connect.on("disconnect", () => {
      setSocket(null);
    });

    //Trigger when sent correct
    connect.on("correct", () => {
      setCorrect(true);
    });

    return () => {
      connect.disconnect();
    };
  }, []);

  useEffect(() => {
    //Send user input to server for validation
    if (socket) {
      socket.emit("userInput", userInput);
    }
  }, [socket, userInput]);

  return (
    <div className="flex flex-col flex-wrap p-8">
      <p>{`Connected: ${socket ? "👍" : "👎"}`}</p>
      <h1>{correct ? "🎉" : null}</h1>
      <label htmlFor="text">Input</label>
      <h2>Hej hej</h2>
      <input
        type="text"
        name="text"
        id="text"
        className="border border-slate-600"
        value={userInput}
        onChange={(e) => {
          if (!correct) {
            setUserInput(e.target.value);
            return;
          }
          return;
        }}
      />
    </div>
  );
};

export default Fight;
