import { useContext, useEffect, useReducer, useState, useRef } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import JoinBlock from "./components/JoinBlock";
import socket from "./socket";
import reducer from "./reducer";
import Chat from "./components/Chat";
import axios from "axios";
import LeftBlock from "./components/left-side/LeftBlock";
import "./components/style/style.css";
import MiddleBlock from "./components/middle-side/MiddleBlock";
import RightBlock from "./components/right-side/RightBlock";
import { ChatContext } from "./components/providers/ChatProvider";

function App() {
  const { state, dispatch } = useContext(ChatContext);
  const getUsersInRoom = () => {
    socket.emit("CONNECT_ROOM", { roomName: state.roomName });
  };

  useEffect(() => {
    socket.on("ROOM:SET_USER", (dataUser) => {
      dispatch({
        type: "SET_USER",
        userName: dataUser.userName,
        userId: dataUser.userId,
        rooms: dataUser.rooms,
        joined: true,
      });
    });

    socket.on("MESSAGES", (messages) => {
      const sortedMessages = messages.sort((a, b) => {
        return a.idMessage - b.idMessage;
      });

      dispatch({
        type: "SET_MESSAGES",
        messages: sortedMessages,
      });
    });

    socket.on("SET_USERS", (data) => {
      dispatch({
        type: "SET_USERS",
        users: data,
      });
    });

    socket.on("QUITED_USER", (data) => {
      dispatch({
        type: "QUITED_USER",
        rooms: data.rooms,
      });
    });

    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const getUsersInRoom2 = () => {
    socket.emit("GET_USERS", { roomName: state.roomName });
  };

  useEffect(() => {
    getUsersInRoom();
    socket.on("QUIT_USER", () => {
      getUsersInRoom2();
    });
    socket.on("SET_USERS_REQUEST", () => {
      getUsersInRoom2();
    });
    getMessagesInRoom();

    return () => {
      socket.off("QUIT_USER");
      socket.off("SET_USERS_REQUEST");
    };
  }, [state.roomName]);

  const getMessagesInRoom = async () => {
    socket.emit("GET_MESSAGES", {
      userId: state.userId,
      roomName: state.roomName,
    });
  };

  window.socket = socket;
  const [size, setSize] = useState({});
  const ref = useRef();

  const resizeHandler = () => {
    const { clientHeight, clientWidth } = ref.current || {};
    if (clientWidth < 830) {
      dispatch({
        type: "HIDE_VISIBLE",
      });
    } else if (clientWidth >= 830) {
      dispatch({
        type: "SHOW_VISIBLE",
      });
    }
  };

  const toggleLeftBlock = () => {
    dispatch({
      type: "TOGGLE_LEFT",
    });
  };

  const toggleRightBlock = () => {
    dispatch({
      type: "TOGGLE_RIGHT",
    });
  };

  useEffect(() => {
    resizeHandler();
  }, [state.joined]);

  //console.log(state);
  return (
    <>
      {state.joined ? (
        <div ref={ref} className="container">
          <LeftBlock toggleLeftBtn={toggleLeftBlock} />
          <MiddleBlock
            toggleLeftBtn={toggleLeftBlock}
            toggleRightBtn={toggleRightBlock}
          />
          <RightBlock toggleRightBtn={toggleRightBlock} />
        </div>
      ) : (
        <JoinBlock resizeBtn={resizeHandler} />
      )}
    </>
  );
}

export default App;
