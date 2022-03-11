import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io();

const game = document.querySelector("#game");

let chain = "";

socket.on("chain", (incoming) => {
  chain = incoming;
  if (game) game.textContent = incoming;
});

document.addEventListener("keypress", (keyBoardEvent) => {
  if (chain[0] === keyBoardEvent.key) {
    chain = chain.slice(1);
    if (game) game.textContent = chain;
  }

  socket.emit("keypress", keyBoardEvent.key);
});
