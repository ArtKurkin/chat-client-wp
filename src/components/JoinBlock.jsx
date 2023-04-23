import { useContext, useState } from "react";
import socket from "../socket";
import axios from "axios";
import { ChatContext } from "./providers/ChatProvider";
import inputChangeHandler from "../inputChangeHandler";

const JoinBlock = ({ onLogin }) => {
  const { state, dispatch } = useContext(ChatContext);
  const [userName, setUserName] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onEnter = async () => {
    const checkedUserName = inputChangeHandler(userName);
    if (
      checkedUserName &&
      checkedUserName.length < 49 &&
      checkedUserName.length > 0
    ) {
      const obj = {
        userName,
      };
      socket.emit("JOIN", obj);
    } else {
      return alert("Неверные данные");
    }

    console.log("Клик есть");
    console.log(userName);
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
