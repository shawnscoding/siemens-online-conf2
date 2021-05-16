import React, { useContext, useEffect, useState } from "react";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import { AuthContext } from "../../store/auth/AuthContext";

const styles = {
  chat: {
    width: "60rem",
    // height: "50rem",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
};

const ChatRoom = ({
  openChat,
  setOpenChat,
  setChatEvent,
  roomId,
  setRoomId,
  nick,
}) => {
  const { chatClient } = useContext(LobbyContext);
  const { user } = useContext(AuthContext);
  const [chatList, setChatList] = useState([]);
  const [myMessage, setMyMessage] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleClick = () => {
    if (myMessage === undefined || myMessage.trim() === "") return;
    chatClient.broadcast(myEmail, myMessage, roomId);
    setMyMessage("");
  };

  const myEmail = user.email; // decodeURIComponent
  const [currentRoom, setCurrentRoom] = useState("");
  const pushMessage = (message, sender) => {
    const item = {};
    item.sender = sender; // me or other
    item.isMine = sender === myEmail; // me or other
    item.message = message;
    setChatList((currentItem) => [...currentItem, item]);
    setTimeout(() => {
      const chatList = document.getElementById("chatList");
      if (chatList) {
        const { scrollHeight } = chatList;
        chatList.scrollTop = scrollHeight;
      }
    }, 100);
  };

  const joinRoomHandler = (payload) => {
    const { room, messages } = payload;

    if (currentRoom !== room) {
      // 신규 입장.
      // 최초 입장.

      setCurrentRoom(room);
      if (
        messages === undefined ||
        messages === null ||
        messages === "" ||
        messages.length === 0
      )
        return;
      // 기존 대화 뿌리기.
      const chatMessages = [];
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const chat = JSON.parse(message);

        const { room, userid, nick, utctime, msg } = chat;
        if (room === undefined) continue;
        if (userid === undefined) continue;

        chatMessages.push(chat);
      }
      chatMessages.sort(function (a, b) {
        // 내림차순
        return a.utctime < b.utctime ? -1 : 0;
      });

      chatMessages.forEach((e, i) => {
        pushMessage(e.msg, e.userid);
      });
    }
  };

  const newMessageHandler = (payload) => {
    const { msg, sender, room } = payload;
    pushMessage(msg, sender);
  };

  const leaveRoomHandler = (payload) => {
    pushMessage(`${nick}님이 퇴장하였습니다.`);
  };

  const leaveRoom = () => {
    chatClient.leaveRoom(currentRoom);
    chatClient.removeChatHandler("joinroom_1");
    chatClient.removeChatHandler("leaveroom_1");
    chatClient.removeChatHandler("newmsg_1");
    setOpenChat(false);
    setCurrentRoom("");
    setRoomId("");
    setChatEvent({});
  };

  useEffect(() => {
    if (chatClient) {
      chatClient.addChatHandler({
        id: "joinroom_1",
        event: "joinroom",
        room: roomId,
        callback: joinRoomHandler,
      });

      chatClient.addChatHandler({
        id: "leaveroom_1",
        event: "leaveroom",
        room: roomId,
        callback: leaveRoomHandler,
      });

      chatClient.addChatHandler({
        id: "newmsg_1",
        event: "newmsg",
        room: roomId,
        callback: newMessageHandler,
      });

      chatClient.joinRoom(roomId);
    }
  }, [openChat]);

  return (
    <div className="popup modal on chatroom">
      <div className="pop-tb" style={styles.chat}>
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2
                style={{
                  textTransform: "none",
                }}
              >
                Chat ({nick})
              </h2>
              <button type="button" className="close" onClick={leaveRoom}>
                close
              </button>
            </div>
            <div className="pop-content" style={{ paddingBottom: "0" }}>
              <div
                className="content-box"
                style={{ height: "100%", overflow: "hidden" }}
              >
                <div className="chat_wrap help">
                  <div className="chat_log" id="chatList">
                    <div className="chat_log_wrap">
                      {chatList &&
                        chatList.map((item, index) => {
                          const { message, isMine } = item;
                          const className = isMine ? "help_user" : "help_guide";

                          return (
                            <ul
                              className={`help_log_item ${className}`}
                              key={index}
                            >
                              <li className="chat_con">
                                <span>{message}</span>
                              </li>
                            </ul>
                          );
                        })}
                    </div>
                  </div>
                  <div className="chat_input_wrap help">
                    <input
                      type="text"
                      className="chat_input help"
                      value={myMessage}
                      onKeyPress={handleKeyPress}
                      onChange={(e) => {
                        setMyMessage(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="send_btn help"
                      onClick={handleClick}
                    >
                      send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
