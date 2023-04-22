import io from "socket.io-client";

const socket = io("http://217.151.230.115:5000/");

const tryReconnect = () => {
  setTimeout(() => {
    socket.io.open((err) => {
      if (err) {
        tryReconnect();
      }
    });
  }, 2000);
};

socket.io.on("close", tryReconnect);

export default socket;
