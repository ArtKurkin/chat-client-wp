import { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import socket from "../socket";
import React from "react";

const Chat = (props) => {
  const [messageValue, setMessageValue] = useState("");
  const messageRef = useRef();

  const onSendMessage = () => {
    socket.emit("ROOM:NEW_MESSAGE", {
      roomId: props.state.roomId,
      userName: props.state.userName,
      text: messageValue,
    });
    props.onAddMessage({
      userName: props.state.userName,
      text: messageValue,
    });
    setMessageValue("");
  };

  useEffect(() => {
    messageRef.current.scrollTo(0, 9999);
  }, [props.state.messages]);

  ////console.log(props.state.messages);
  return (
    <div className={styles.chat}>
      <div className={styles.wrapper}>
        <div className={styles.users}>
          <div className={styles.room}>
            <b>Комната: {props.state.roomId}</b>
          </div>
          <ul className={styles["user-list"]}>
            {props.state.users.map((name, index) => (
              <li key={name + index}>{name}</li>
            ))}
          </ul>
        </div>
        <div className={styles["messages-box"]}>
          <div ref={messageRef} className={styles.messages}>
            {props.state.messages.map((message) => {
              return (
                <React.Fragment key={Math.random()}>
                  <div className={styles.message}>{message.text}</div>
                  <div>{message.userName}</div>
                </React.Fragment>
              );
            })}
          </div>
          <div className={styles["text-input"]}>
            <form>
              <textarea
                onChange={(e) => setMessageValue(e.target.value)}
                className={styles.txt}
                value={messageValue}
                rows="3"
              ></textarea>
              <button onClick={onSendMessage} className="btn" type="button">
                Отправить
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
