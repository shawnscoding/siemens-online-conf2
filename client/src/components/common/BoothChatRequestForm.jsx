import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../store/auth/AuthContext";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import { apiClient } from "../../utils/data/api";

const styles = {
  li: {
    height: "4rem",
  },
  label: {
    display: "block",
    height: "100%",
  },
  span: {
    display: "inline-block",
    height: "100%",
    width: "32%",
    lineHeight: "4rem",
  },
  input: {
    height: "100%",
  },
};
const BoothChatRequestForm = ({ boothInfo, setOpenBoothChatRequestForm }) => {
  const { user } = useContext(AuthContext);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const comment = useRef("");
  const close = () => {
    setOpenBoothChatRequestForm(false);
  };

  const submit = async () => {
    if (loading) return;
    try {
      if (!comment.current.value) return setMsg("희망상담기간을 입력해주세요.");
      setLoading(true);
      await apiClient.post("/requestMeeting", {
        comment: comment.current.value,
        company_idx: boothInfo.idx,
      });

      setMsg("신청이 완료되었습니다.");
      setLoading(false);
      comment.current.value = "";
    } catch (error) {
      setLoading(false);
      console.error("post booth chat waiting form error:  ", error);
    }
  };

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
                >
                  <div>
                    <p style={{ fontSize: "2.4rem" }}>
                      현재 담당자가 상담 또는 부재중입니다.
                      <br />
                      추후 연락드릴 수 있도록 담당자에게
                      <br />
                      연락처를 남기겠습니까?
                    </p>
                    <ul style={{ margin: "2rem 0" }}>
                      <li style={styles.li}>
                        <label htmlFor="chat_name">
                          <span style={styles.span}>이름</span>
                          <input
                            id="chat_name"
                            type="text"
                            style={styles.input}
                            placeholder="이름"
                            value={user.name}
                            readOnly
                          />
                        </label>
                      </li>
                      <li style={styles.li}>
                        <label htmlFor="chat_title">
                          <span style={styles.span}>직함</span>
                          <input
                            id="chat_title"
                            type="text"
                            style={styles.input}
                            placeholder="직함"
                            value={user.title}
                            readOnly
                          />
                        </label>
                      </li>
                      <li style={styles.li}>
                        <label htmlFor="chat_afiliation">
                          <span style={styles.span}>소속</span>
                          <input
                            id="chat_afiliation"
                            type="text"
                            style={styles.input}
                            placeholder="소속"
                            value={user.affiliation}
                            readOnly
                          />
                        </label>
                      </li>
                      <li style={styles.li}>
                        <label htmlFor="chat_email">
                          <span style={styles.span}>이메일</span>
                          <input
                            id="chat_email"
                            type="text"
                            style={styles.input}
                            placeholder="이메일"
                            value={user.email}
                            readOnly
                          />
                        </label>
                      </li>
                      <li style={styles.li}>
                        <label htmlFor="chat_phone">
                          <span style={styles.span}>연락처</span>
                          <input
                            id="chat_phone"
                            type="text"
                            style={styles.input}
                            placeholder="연락처"
                            value={user.mobile_no}
                            readOnly
                          />
                        </label>
                      </li>
                      <li style={styles.li}>
                        <label htmlFor="chat_date">
                          <span style={styles.span}>희망 상담시간 / 내용</span>
                          <input
                            id="chat_date"
                            ref={comment}
                            type="text"
                            style={styles.input}
                            placeholder="희망 상담시간 / 내용"
                          />
                        </label>
                      </li>
                    </ul>
                    <div style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={submit}
                        style={{
                          width: "10rem",
                          height: "4rem",
                          backgroundColor: "rgb(46, 49, 93)",
                          color: "#fff",
                        }}
                      >
                        전송
                      </button>
                    </div>
                    {msg && (
                      <div
                        className="popbtn__error"
                        style={{ position: "relative", color: "blue" }}
                      >
                        {msg}
                      </div>
                    )}
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

export default BoothChatRequestForm;
