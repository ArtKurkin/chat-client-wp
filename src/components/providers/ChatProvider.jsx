import { createContext, useState, useReducer } from "react";

export const ChatContext = createContext({
  joined: false,
  roomId: null,
  userName: null,
  users: [],
  messages: [],
  userId: null,
  rooms: [],
  roomName: null,
  leftBlock: true,
  rightBlock: true,
  isVisible: true,
  userClickLeft: false,
  userClickRight: false,
});

const reducer = (state, action) => {
  switch (action.type) {
    case "JOINED":
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomName,
      };
    case "RESET_USER":
      return {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: [],
        userId: null,
        rooms: [],
        roomName: null,
        leftBlock: true,
        rightBlock: true,
        isVisible: true,
        userClickLeft: false,
        userClickRight: false,
      };
    case "SET_USERSINROOM":
      return {
        ...state,
        roomName: action.roomName,
        selectedMessage: null,
        userClickLeft: false,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.users,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.messages,
      };
    case "SET_USER":
      return {
        ...state,
        rooms: action.rooms,
        userName: action.userName,
        userId: action.userId,
        joined: action.joined,
      };
    case "QUITED_USER":
      return {
        ...state,
        rooms: action.rooms,
        users: [],
        messages: [],
        roomName: null,
      };
    case "SET_ROOMS":
      return {
        ...state,
        rooms: action.rooms,
      };
    case "SET_DATA":
      return {
        ...state,
        users: action.payload.users,
        messages: [...action.payload.messages],
      };
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SELECT_MESSAGE":
      return {
        ...state,
        selectedMessage: action.message,
      };
    case "TOGGLE_LEFT":
      return {
        ...state,
        userClickLeft: !state.userClickLeft,
      };
    case "TOGGLE_RIGHT":
      return {
        ...state,
        userClickRight: !state.userClickRight,
      };

    case "HIDE_LEFT":
      return {
        ...state,
        userClickLeft: false,
      };
    case "HIDE_RIGHT":
      return {
        ...state,
        userClickRight: false,
      };

    case "SET_RIGHTSIZE":
      return {
        ...state,
        rightBlockSize: action.size,
      };
    case "HIDE_VISIBLE":
      return {
        ...state,
        rightBlock: false,
        leftBlock: false,
      };
    case "SHOW_VISIBLE":
      return {
        ...state,
        rightBlock: true,
        leftBlock: true,
        userClickLeft: false,
        userClickRight: false,
      };
    case "SHOW_VISIBLE_RIGHT":
      return {
        ...state,
        rightBlock: true,
        leftBlock: true,
      };
    case "TOGGLE_CLICK":
      return {
        ...state,
      };
    default:
      return state;
  }
};

const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
    userId: null,
    rooms: [],
    selectedMessage: null,
    leftBlock: true,
    rightBlock: true,
    isVisible: true,
    userClickLeft: false,
    userClickRight: false,
  });
  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
