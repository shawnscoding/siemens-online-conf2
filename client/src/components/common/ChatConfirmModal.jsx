import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import { AuthContext } from "../../store/auth/AuthContext";

const classes = {
  text: {
    display: "block",
    fontSize: "2.5rem",
    lineHeight: "3rem",
  },
};
const ChatConfirmModal = ({ setRoomId, setNick, setOpenChat }) => {
  const {
    modalManager: { chat },
    setModalManager,
    chatClient,
  } = useContext(LobbyContext);
  const { user } = useContext(AuthContext);
  const { option } = chat;
  const { from, message, nick } = option;
  const [isInit, setIsInit] = useState(false);
  const [count, setCount] = useState(0);
  const timer = useRef(0);
  const getRoomId = (room) => {
    const roomId = btoa(room).replace(/\=/gi, "");
    return roomId;
  };

  const close = () => {
    setModalManager((prev) => ({
      ...prev,
      chat: {
        open: false,
        option: {
          from: {},
          message: "",
        },
      },
    }));
  };

  const accept = () => {
    const type = "to";
    const userList = [];
    userList.push(from); // 초대한 사람.
    userList.push(user.email); // 초대받은 사람.
    userList.sort();
    const roomName = userList.join("|");
    const roomId = getRoomId(roomName);
    const payload = {
      type: "invite.room",
      from: user.email,
      nick: user.name,
      roomId,
      message: `${user.name}님이 초대를 수락하였습니다.`,
    };
    const to = from;
    chatClient.custom(type, payload, to);
    setRoomId(roomId);
    setNick(nick);
    setOpenChat(true);
    close();
  };

  const startWaitingTimer = (sec) => {
    setIsInit(true);
    setCount(sec);
    timer.current = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer.current);
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startWaitingTimer(15);
    return () => clearInterval(timer.current);
  }, [from]);

  useEffect(() => {
    if (!count && isInit) {
      close();
    }
  }, [count]);

  return (
    <>
      <div
        style={{
          zIndex: 999999,
        }}
        className="popup messagebox"
      >
        <div className="pop-tb schedule event">
          <div className="pop-cell zoomIn">
            <div className="login-box msg-box">
              <div className="msg-header">
                <button className="close" onClick={close}>
                  close
                </button>
              </div>
              <div className="pop-content chat-alert">
                <div
                  style={{
                    padding: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="alert-mess"
                >
                  <div>
                    {message.split("\n").map((line, index) => {
                      return (
                        <p style={classes.text} key={index}>
                          {line}
                          <br />
                        </p>
                      );
                    })}
                    <div
                      style={{
                        margin: "2rem 0",
                        height: "4rem",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          background: "#2e315d",
                          height: "100%",
                          color: "white",
                          width: "10rem",
                          fontSize: "1.7rem",
                          borderRadius: ".5rem",
                          marginRight: "1rem",
                        }}
                        onClick={accept}
                      >
                        수락
                        {count ? `(${count})` : null}
                      </button>
                      <button
                        type="button"
                        style={{
                          background: "#2e315d",
                          height: "100%",
                          color: "white",
                          width: "10rem",
                          fontSize: "1.7rem",
                          borderRadius: ".5rem",
                          marginLeft: "1rem",
                        }}
                        onClick={close}
                      >
                        거절
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ChatConfirmModal.propType = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default ChatConfirmModal;
