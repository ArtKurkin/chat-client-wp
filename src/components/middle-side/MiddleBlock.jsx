import axios from "axios";
import { useContext, useEffect, useReducer, useState, useRef } from "react";
import { ChatContext } from "../providers/ChatProvider";
import socket from "../../socket";

const MiddleBlock = (props) => {
  const { state, dispatch } = useContext(ChatContext);
  const [message, setMessage] = useState("");
  const [isSelect, setSelect] = useState(false);
  const messageRef = useRef();

  useEffect(() => {
    setSelect(false);
  }, [state.roomName]);

  useEffect(() => {
    messageRef.current.scrollTo(0, 9999);
  }, [state.messages]);

  const sendMessage = async () => {
    socket.emit("NEW_MESSAGES", {
      userId: state.userId,
      roomName: state.roomName,
      content: message,
    });

    setSelect(false);
    dispatch({
      type: "SELECT_MESSAGE",
      message: null,
    });

    setMessage("");
  };

  const editMessage = () => {
    socket.emit("EDIT_MESSAGE", {
      message: state.selectedMessage,
      changeText: message,
      roomName: state.roomName,
    });

    dispatch({
      type: "SELECT_MESSAGE",
      message: null,
    });
    setSelect(false);
    setMessage("");
  };

  const deleteMessage = () => {
    socket.emit("DELETE_MESSAGE", {
      message: state.selectedMessage,
      roomName: state.roomName,
    });

    dispatch({
      type: "SELECT_MESSAGE",
      message: null,
    });

    setSelect(false);
  };

  const selectMessage = (message) => {
    if (isSelect) {
      setSelect((prev) => !prev);
      dispatch({
        type: "SELECT_MESSAGE",
        message: null,
      });
      setMessage("");
    } else {
      setSelect((prev) => !prev);
      dispatch({
        type: "SELECT_MESSAGE",
        message: message,
      });
      setMessage(message.text);
    }
  };

  const quitRoom = () => {
    socket.emit("QUIT_ROOM", {
      roomName: state.roomName,
      userId: state.userId,
    });
  };

  return (
    <div className="middle-side">
      <div className="user-box chat-mod">
        <div onClick={props.toggleLeftBtn} className="search-button show-side">
          <svg
            className="search-icon "
            width="25px"
            height="25px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g id="Edit / Text_Align_Left">
                <path
                  id="Vector"
                  d="M4 18H14M4 14H20M4 10H14M4 6H20"
                  stroke="#fff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </g>
          </svg>
        </div>
        {/* <!-- данные о комнате --> */}
        {state.roomName ? (
          <div className="user-info">
            {/* <div className="user-logo"></div> */}

            <div className="user-data chat-info-mod">
              <div className="user-name">{state.roomName}</div>
              <div className="user-status chat-status-mod">
                Участники: {state.users.length}
              </div>
            </div>
            {/* <!-- Кнопка выхода --> */}
            <div onClick={quitRoom} className="quit-user">
              <svg
                className="quit-icon"
                width="25"
                height="25"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.6667 11.3333L14 7.99996L10.6667 4.66663"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 8H6"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        ) : (
          ""
        )}

        {state.selectedMessage ? (
          <div className="message-edit">
            <div onClick={editMessage} className="search-button">
              <svg
                className="search-icon edit-mod"
                width="25px"
                height="25px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0" />

                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <g id="SVGRepo_iconCarrier">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </div>
            <div onClick={deleteMessage} className="search-button">
              <svg
                className="search-icon"
                width="25px"
                height="25px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0" />

                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />

                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M10 11V17"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14 11V17"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4 7H20"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                    stroke="#fff"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </svg>
            </div>
          </div>
        ) : (
          ""
        )}

        <div onClick={props.toggleRightBtn} className="search-button show-side">
          <svg
            className="search-icon"
            width="25px"
            height="25px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g id="Edit / Text_Align_Right">
                <path
                  id="Vector"
                  d="M20 18H10M20 14H4M20 10H10M20 6H4"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
      {/* <!-- Блок сообщений --> */}
      <div ref={messageRef} className="chat-window">
        {/* <!-- Одно сообщение пользователя --> */}
        {state.messages.map((message) => {
          const msg =
            state.selectedMessage != undefined //&& isSelect
              ? state.selectedMessage.text
              : "";
          if (message.userName == state.userName) {
            return (
              <div
                key={message.isMessage}
                onClick={selectMessage.bind(null, message)}
                className="message message-me"
              >
                <div className="user-logo"></div>
                <div
                  className={
                    msg == message.text
                      ? "message-content message-content-me selected-message"
                      : "message-content message-content-me"
                  }
                >
                  <div className="message-name">{message.userName}</div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="message">
                <div className="user-logo"></div>
                <div className="message-content">
                  <div className="message-name">{message.userName}</div>
                  <div className="message-text">{message.text}</div>
                </div>
              </div>
            );
          }
        })}
      </div>

      {/* <!-- Блок ввода сообщения --> */}
      {state.roomName ? (
        <div className="chat-input message-mod">
          <div className="search-box message-input-mod">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="search-input"
              type="text"
              name=""
              id=""
              placeholder="Введите сообщение"
            />

            <div onClick={sendMessage} className="search-button">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.14 0.960012L5.11 3.96001C-0.960005 5.99001 -0.960005 9.30001 5.11 11.32L7.79 12.21L8.68 14.89C10.7 20.96 14.02 20.96 16.04 14.89L19.05 5.87001C20.39 1.82001 18.19 -0.389988 14.14 0.960012ZM14.46 6.34001L10.66 10.16C10.51 10.31 10.32 10.38 10.13 10.38C9.94 10.38 9.75 10.31 9.6 10.16C9.46052 10.0189 9.38229 9.82844 9.38229 9.63001C9.38229 9.43158 9.46052 9.24115 9.6 9.10001L13.4 5.28001C13.69 4.99001 14.17 4.99001 14.46 5.28001C14.75 5.57001 14.75 6.05001 14.46 6.34001Z"
                  fill="#fff"
                />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MiddleBlock;
