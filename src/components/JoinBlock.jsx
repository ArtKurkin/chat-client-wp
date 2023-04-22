import { useContext, useState } from "react";
import socket from "../socket";
import axios from "axios";
import { ChatContext } from "./providers/ChatProvider";

const JoinBlock = ({ onLogin }) => {
  const { state, dispatch } = useContext(ChatContext);
  const [userName, setUserName] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onEnter = async () => {
    if (!userName) return alert("Неверные данные");
    const obj = {
      userName,
    };

    console.log("Клик есть");
    console.log(userName);

    socket.emit("JOIN", obj);
  };

  return (
    <div className="join-block">
      <div>
        <input
          type="text"
          className="userName"
          placeholder="Имя пользователя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button disabled={isLoading} onClick={onEnter} className="login">
          {isLoading ? "Вход..." : "Войти"}
        </button>
      </div>
    </div>
  );
};

export default JoinBlock;
