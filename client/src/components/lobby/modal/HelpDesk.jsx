import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import { AuthContext } from "../../../store/auth/AuthContext";

const HelpDesk = () => {
  // need to call server api
  const {
    modalManager: { helpDesk },
    chatClient,
    setModalManager,
  } = useContext(LobbyContext);
  const { user } = useContext(AuthContext);
  const { open } = helpDesk;
  const [chatList, setChatList] = useState([]);
  const [myMessage, setMyMessage] = useState("");

  const myEmail = user.email; // decodeURIComponent
  const myNick = user.name;
  const ROOM = `QA_${myEmail}`;
  let currentRoom = "";
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };
  const handleClick = (e) => {
    if (myMessage === undefined || myMessage.trim() === "") return;
    chatClient.broadcast(myEmail, myMessage, ROOM);
    setMyMessage("");
  };
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

      currentRoom = room;
      if (
        messages === undefined ||
        messages === null ||
        messages === "" ||
        messages.length === 0
      ) {
        pushMessage(
          `안녕하세요. 무엇을 도와드릴까요? (문의사항 접수 후 잠시만 기다려주세요. 헬프데스크 창을 닫으실 경우 담당자의 답변을 받으실 수 없습니다.)`
        );
        return;
      }

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

      pushMessage(
        `안녕하세요. 무엇을 도와드릴까요? (문의사항 접수 후 잠시만 기다려주세요. 헬프데스크 창을 닫으실 경우 담당자의 답변을 받으실 수 없습니다.)`
      );
    }
  };

  const newMessageHandler = (payload) => {
    const { msg, sender } = payload;
    pushMessage(msg, sender);
  };

  useEffect(() => {
    if (open === false) {
      setChatList([]);
      return;
    }
    chatClient.addChatHandler({
      id: "joinroom_1",
      event: "joinroom",
      room: ROOM,
      callback: joinRoomHandler,
    });

    chatClient.addChatHandler({
      id: "newmsg_1",
      event: "newmsg",
      room: ROOM,
      callback: newMessageHandler,
    });

    const noticeRole = "agent";
    chatClient.joinRoom(ROOM, noticeRole);
  }, [open]);

  const handleClose = () => {
    // Leave QA 방.
    const noticeRole = "agent";
    chatClient.leaveRoom(ROOM, noticeRole);
    chatClient.removeChatHandler("joinroom_1");
    chatClient.removeChatHandler("newmsg_1");
    setModalManager((prev) => ({
      ...prev,
      helpDesk: {
        open: false,
      },
    }));
  };

  if (!open) return <></>;

  return (
    <div className="popup modal">
      <div className="pop-tb help">
        <div className="pop-cell zoomIn">
          <div classname="modal-box help" style={{ backgroundColor: 'white' }}>
            <div className="modal-header">
              <h2>Help Desk</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>

            <div className="pop-content data-table over-hidden h100 pd0 help">
              <div className="content-box h100">
                <div className="chat_wrap help">
                  <div className="chat_time">(Operation Hour 08:00 ~18:00)</div>
                  <div className="chat_log help" id="chatList" style={{ height: 'calc(60vh - 60px)' }}>
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
                  <div className="chat_input_wrap help" style={{ height: '60px' }}>
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

HelpDesk.propTypes = {
  data: PropTypes.shape({}),
};

HelpDesk.defaultProps = {
  data: null,
};

export default HelpDesk;
