import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import { urls } from "../utils/url";

const Fight = () => {
  const router = useRouter();
  const { id } = router.query;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [correct, setCorrect] = useState<boolean>(false);
  const [word, setWord] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("_tftoken");
    const connect = io(urls.api) ?? null;
    //Trigger on connect
    connect.on("connect", () => {
      setSocket(connect);
    });

    //Trigger on disconnect
    connect.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      connect.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //Send user input to server for validation
    if (socket) {
      const token = sessionStorage.getItem("_tftoken");
      socket.emit("user_input", userInput, id, token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, userInput]);

  useEffect(() => {
    if (id && socket) {
      const token = sessionStorage.getItem("_tftoken");
      socket.emit("join_room", id, token);
      console.log(`join_room: ${id}`);
    }
  }, [id, socket]);

  useEffect(() => {
    if (socket) {
      //Trigger when sent word
      socket.on("word", (word: string) => {
        setWord(word);
      });

      //Trigger on countdown
      socket.on("countdown", (value) => {
        console.log(`Setting countdown: ${value}`);
        setCountdown(value);
      });

      //Trigger when sent correct
      socket.on("correct", (time) => {
        setCorrect(true);
        setCompletionTime(time);
      });

      //Trigger when server wants to redirect client
      socket.on("redirect", (url) => {
        router.push(url);
      });

      //Trigger on server message
      socket.on("message", (message) => {
        alert(message);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div className="flex flex-col flex-wrap p-8">
      <button
        onClick={() => {
          if (socket) {
            socket.emit("start_game", id);
          }
        }}
      >
        Start
      </button>
      <h1>{countdown ? countdown : null}</h1>
      <h1>
        {completionTime
          ? `Completiontime: ${completionTime / 1000} seconds`
          : null}
      </h1>
      <p>{`Connected: ${socket ? "👍" : "👎"}`}</p>
      <h1>Type: {word ? word : null}</h1>
      <h1>{correct ? "🎉" : null}</h1>
      <label htmlFor="text">Input</label>
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
