import { useContext, useEffect, useReducer, useState } from "react";
import "../style/style.css";
import { ChatContext } from "../providers/ChatProvider";
import axios from "axios";
import inputChangeHandler from "../../inputChangeHandler";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCHINGROOM":
      return {
        ...state,
        showSearchRoom: true,
        searchRoom: action.room,
        searching: true,
      };
    case "SET_ADDWINDOW":
      return {
        ...state,
        showSearchRoom: false,
        searching: true,
      };
    case "SET_USERROOMS":
      return {
        ...state,
        showSearchRoom: false,
        searching: false,
        rooms: action.rooms,
      };
    case "SET_ROOMS":
      return {
        ...state,
        showSearchRoom: false,
        searching: false,
      };
    default:
      return state;
  }
};

const LeftBlock = (props) => {
  const { state, dispatch } = useContext(ChatContext);
  const [serachValue, setSearchValue] = useState("");

  const [roomState, roomDispatch] = useReducer(reducer, {
    searching: false,
    showSearchRoom: false,
    searchRoom: [],
    rooms: [],
  });

  const getRooms = async () => {
    const { data } = await axios.get(
      `http://217.151.230.115:5000/rooms/${state.userId}/`
    );
    roomDispatch({
      type: "SET_USERROOMS",
      rooms: data,
    });

    dispatch({
      type: "SET_ROOMS",
      rooms: data,
    });
  };

  useEffect(() => {
    getRooms();
  }, []);

  const inputChangeValue = (e) => {
    const checkedRoomName = inputChangeHandler(e.target.value);
    if (
      checkedRoomName &&
      checkedRoomName.length < 49 &&
      checkedRoomName.length > 0
    ) {
      console.log("Название комнаты проверку прошел");
      setSearchValue(e.target.value);
    }
    if (!e.target.value.trim() && roomState.searching) {
      getRooms();
    }
  };

  const searchClick = async () => {
    const checkedRoomName = inputChangeHandler(serachValue);
    if (
      checkedRoomName &&
      checkedRoomName.length < 49 &&
      checkedRoomName.length > 0
    ) {
      const { data } = await axios.post(`http://217.151.230.115:5000/rooms/`, {
        roomName: serachValue,
      });
      if (data.length) {
        roomDispatch({
          type: "SET_SEARCHINGROOM",
          room: data,
        });
      } else {
        roomDispatch({
          type: "SET_ADDWINDOW",
        });
      }
    } else {
      return alert("Неверные данные");
    }
  };

  const addChat = async (room) => {
    const { data } = await axios.post(`http://217.151.230.115:5000/room/`, {
      userId: state.userId,
      room: room,
    });

    dispatch({
      type: "SET_USERSINROOM",
      roomName: room,
    });

    setSearchValue("");

    getRooms();
  };

  const selectRoom = (room) => {
    dispatch({
      type: "SET_USERSINROOM",
      roomName: room,
    });
  };

  const createRoom = async () => {
    const { data } = await axios.post(`http://217.151.230.115:5000/newroom/`, {
      roomName: serachValue,
      userId: state.userId,
    });

    dispatch({
      type: "SET_USERSINROOM",
      roomName: data.roomName,
    });

    getRooms();
  };

  const quitUser = () => {
    window.location.reload();
  };

  return (
    <div
      className={
        state.leftBlock
          ? "left-side"
          : state.userClickLeft
          ? "left-side"
          : "left-side hide-left"
      }
    >
      {/* Блок с информацией о пользователе */}
      <div className="user-box">
        <div className="user-info ">
          {/* <div className="user-logo"></div> */}
          <div className="user-data chat-info-mod">
            <div className="user-name">{state.userName}</div>
            <div className="user-status">
              <div className="status"></div>
              Online
            </div>
          </div>
          <div onClick={quitUser} type="submit" className="quit-user">
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
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.6667 11.3333L14 7.99996L10.6667 4.66663"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8H6"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div onClick={props.toggleLeftBtn} className="search-button show-side">
          <svg
            fill="#ffffff"
            className="search-icon "
            width="25px"
            height="25px"
            viewBox="0 0 32 32"
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
              {" "}
              <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />{" "}
            </g>
          </svg>
        </div>
      </div>

      {/* <!-- Блок с поиском чата --> */}
      <div className="chat">
        <div className="chat-text">Чаты</div>
        <div className="search-box">
          <input
            value={serachValue}
            onChange={inputChangeValue}
            className="search-input"
            type="text"
            name=""
            id=""
            placeholder="Название чата"
          />
          <div onClick={searchClick} className="search-button">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L19 19M10.5 20C11.7476 20 12.9829 19.7543 14.1355 19.2769C15.2881 18.7994 16.3354 18.0997 17.2175 17.2175C18.0997 16.3354 18.7994 15.2881 19.2769 14.1355C19.7543 12.9829 20 11.7476 20 10.5C20 9.25244 19.7543 8.0171 19.2769 6.86451C18.7994 5.71191 18.0997 4.66464 17.2175 3.78249C16.3354 2.90033 15.2881 2.20056 14.1355 1.72314C12.9829 1.24572 11.7476 1 10.5 1C7.98044 1 5.56408 2.00089 3.78249 3.78249C2.00089 5.56408 1 7.98044 1 10.5C1 13.0196 2.00089 15.4359 3.78249 17.2175C5.56408 18.9991 7.98044 20 10.5 20V20Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* <!-- Блок со списком чатов пользователя --> */}
      <div className="wrapper">
        <div className="chat-list wrapper-list">
          {/* <!-- Блок одного чата --> */}
          {!roomState.searching ? (
            state.rooms.map((room) => {
              return (
                <div
                  onClick={selectRoom.bind(null, room)}
                  key={room}
                  className={
                    room == state.roomName
                      ? "chat-item chat-selected"
                      : "chat-item"
                  }
                >
                  <div className="user-info">
                    {/* <div className="user-logo"></div> */}
                    <div className="user-data">
                      <div className="user-name">{room}</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : roomState.showSearchRoom ? (
            roomState.searchRoom.map((room) => {
              return (
                <div key={room} className="chat-item">
                  <div className="user-info">
                    {/* <div className="user-logo"></div> */}
                    <div className="user-data">
                      <div className="user-name">{room}</div>
                    </div>
                  </div>
                  {!state.rooms.includes(roomState.searchRoom[0]) ? (
                    <div
                      onClick={addChat.bind(null, room)}
                      className="add-chat"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 3.33331V12.6666"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33334 8H12.6667"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })
          ) : (
            <div className="create-chat">
              <div className="create-chat-text">Нет такого чата, создать?</div>
              <div onClick={createRoom} className="add-button">
                Создать
              </div>
              {/* <div className="add-button">Отмена</div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftBlock;
