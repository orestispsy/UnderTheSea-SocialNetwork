import { chatMessages, chatMessage } from "./actions";
import { io } from "socket.io-client"

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("trying to talk to everyone", (data) => {
            console.log("io data",data)
        })
          socket.on("chatMessages", (msgs) => {
              store.dispatch(chatMessages(msgs));
              console.log("chatMessages received in socket", msgs);
          });

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};
