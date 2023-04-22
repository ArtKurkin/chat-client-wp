import axios from "axios";
import socket from "../../socket";
import { ChatContext } from "../providers/ChatProvider";
import { useContext, useEffect, useRef, useState } from "react";

const RightBlock = (props) => {
  const { state, dispatch } = useContext(ChatContext);

  return (
    <div
      className={
        state.rightBlock
          ? "right-side"
          : state.userClickRight
          ? "right-side"
          : "right-side hide-right"
      }
    >
      {/* <!-- Блок информации о чате --> */}
      <div class="user-box ">
        <div className="chat-text">Пользователи в комнате:</div>
        <div onClick={props.toggleRightBtn} className="search-button show-side">
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

      {/* <!-- Обертка со скролом листа пользователей  --> */}
      <div className="wrapper">
        {/* <!-- Блок пользователей онлайн --> */}
        <div className="chat chat-mod">
          <div className="chat-text chat-users">Online:</div>
          <div className="chat-list">
            {state.users
              .filter((user) => {
                return user.isonline;
              })
              .map((user) => {
                return (
                  <div key={user.name} className="chat-item">
                    <div className="user-info">
                      {/* <div className="user-logo"></div> */}
                      <div className="user-data">
                        <div className="user-name">{user.name}</div>
                        <div className="user-status">
                          <div className="status"></div>
                          Online
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* <!-- Блок пользователей офлайн --> */}

        <div className="chat chat-mod">
          <div className="chat-text chat-users">Offline:</div>
          <div className="chat-list">
            {state.users
              .filter((user) => {
                return !user.isonline;
              })
              .map((user) => {
                return (
                  <div className="chat-item">
                    <div className="user-info">
                      {/* <div className="user-logo"></div> */}
                      <div className="user-data">
                        <div className="user-name">{user.name}</div>
                        <div className="user-status ">
                          <div className="status status-offline"></div>
                          Offline
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBlock;
