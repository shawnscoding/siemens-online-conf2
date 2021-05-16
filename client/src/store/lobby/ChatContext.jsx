import { useEffect, useContext, useState } from "react";
// import SalinTextChat from "salin-textchat-client-node";
import { AuthContext } from "../auth/AuthContext";

const useChat = () => {
  const { user } = useContext(AuthContext);
  const [chatClient, setChatClient] = useState(null);
  const myEmail = user.email; // decodeURIComponent
  const myNick = user.name;

  // useEffect(() => {
  //   const param = `userid=${encodeURIComponent(myEmail)}&nick=${myNick}`;
  //   const server = `${process.env.REACT_APP_WEBSOCKET_SERVER}/?${param}`;
  //   const callback = {
  //     connect: () => {
  //       console.log("TextChat connected");
  //     },
  //     disconnect: () => {
  //       console.log("TextChat disconnected");
  //     },
  //     newmsg: (payload) => {
  //       const newMessageHandler = SalinTextChat.handlerList.find(
  //         (v) => v.event === "newmsg" && v.room === payload.room
  //       );
  //       if (newMessageHandler) {
  //         newMessageHandler.callback(payload);
  //       }
  //     },
  //     error: (error) => {
  //       console.log(`socket error callback=${JSON.stringify(error)}`);
  //     },
  //     joinroom: (payload) => {
  //       const joinRoomHandler = SalinTextChat.handlerList.find(
  //         (v) => v.event === "joinroom" && v.room === payload.room
  //       );
  //       if (joinRoomHandler) {
  //         joinRoomHandler.callback(payload);
  //       }
  //     },
  //     leaveroom: (payload) => {
  //       const leaveRoomHandler = SalinTextChat.handlerList.find(
  //         (v) => v.event === "leaveroom" && v.room === payload.room
  //       );
  //       if (leaveRoomHandler) {
  //         leaveRoomHandler.callback(payload);
  //       }
  //     },
  //     status: (payload) => {},
  //     custom: (payload) => {
  //       const customMessageHandler = SalinTextChat.handlerList.find(
  //         (v) => v.event === "custom"
  //       );

  //       if (customMessageHandler) {
  //         customMessageHandler.callback(payload);
  //       }
  //     },
  //   };
  //   if (user.idx !== 0) {
  //     SalinTextChat.handlerList = [];
  //     SalinTextChat.addChatHandler = (handler) => {
  //       if (SalinTextChat.handlerList.includes(handler) === false) {
  //         SalinTextChat.handlerList.push(handler);
  //       }
  //     };
  //     SalinTextChat.removeChatHandler = (id) => {
  //       if (!id) return null;
  //       SalinTextChat.handlerList = SalinTextChat.handlerList.filter(
  //         (v) => v.id !== id
  //       );
  //     };
  //     SalinTextChat.create(server, callback);
  //     setChatClient(SalinTextChat);
  //   }
  // }, [user]);

  return [chatClient];
};

export default useChat;
