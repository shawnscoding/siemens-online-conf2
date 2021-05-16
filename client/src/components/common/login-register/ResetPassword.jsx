import React, { useState } from "react";
import { apiClient } from "../../../utils/data/api";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";

const LoginCloseBtn = styled.button`
  position: absolute;
  z-index: 10;
  right: 8px;
  top: 21px;
  color: inherit;
  cursor: pointer;
`;

const StyledCloseIcon = styled(CloseIcon)`
  width: 36px !important;
  height: 36px !important;
  color: #d4d4d4;
`;

const ResetPassword = ({ onPrev, onCloseModal }) => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
  });

  const [isSucceeded, setIsSucceeded] = useState(false);

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;

    if (name === "phone") {
      const regex = /^[0-9\b -]{0,13}$/;
      if (regex.test(value)) {
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const [msg, setMsg] = useState({
    id: null,
    msg: null,
  });

  const handleResetPassword = async () => {
    const { email } = form;
    if (!email.length) {
      setMsg({
        id: "400",
        msg: "이메일을 입력해주세요.",
      });
      return;
    }
    try {
      const phone = Number(form.phone);
      const res = await apiClient.post("/register/resetPassword", {
        email,
        phone,
      });
      if (res.data) {
        setIsSucceeded(true);
      }
    } catch (err) {
      console.log("handleResetPassword err ::", err.response);
      const { error, code } = err.response.data;
      setMsg({
        id: code,
        msg: error,
      });
    }
  };

  return (
    <>
      {isSucceeded === false ? (
        <div className="popup">
          <div className="pop-tb pw-reset">
            <div className="pop-cell zoomIn">
              <div
                className="login-box"
                style={{
                  position: "relative",
                }}
              >
                <LoginCloseBtn
                  type="button"
                  className="login__close-btn"
                  title="Close"
                  onClick={onCloseModal}
                >
                  <StyledCloseIcon />
                </LoginCloseBtn>
                <div className="pw-header loginbox__header line2">
                  <button type="button" onClick={onPrev} className="prev">
                    prev
                  </button>
                  <h2>Password Assistance</h2>
                </div>
                <div className="pop-content">
                  <div className="form-inbox">
                    <ul>
                      <li className="reset-pw">
                        <p className="txt">
                          등록하신 Email을 입력해주세요.
                          <br />
                          등록하신 Email로 임시 비밀번호를 발송합니다.
                        </p>
                      </li>
                      <li>
                        <label htmlFor="email">
                          <span>email</span>
                          <input
                            id="email"
                            type="text"
                            title="mail"
                            name="email"
                            onChange={handleChange}
                            value={form.email}
                            placeholder="이메일 주소를 입력해주세요."
                          />
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div className="btn-login">
                    {msg.msg && <div className="error">{msg.msg}</div>}
                    <button type="button" onClick={handleResetPassword}>
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="popup">
          <div className="pop-tb pw-reset">
            <div className="pop-cell zoomIn">
              <div className="login-box">
                <div className="pw-header loginbox__header line2">
                  <h2>Password Assistance</h2>
                </div>
                <div className="pop-content">
                  <div
                    style={{
                      padding: "4rem 6rem 1rem",
                    }}
                    className="form-inbox"
                  >
                    <ul>
                      <li className="reset-pw">
                        <p className="txt">
                          등록하신 Email로 임시비밀번호를 발송하였습니다.
                          <br />
                          최초로그인 이후 마이페이지에서 비밀번호를 변경하실 수
                          있습니다.
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="btn-login">
                    <button type="button" onClick={onPrev}>
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ResetPassword.propTypes = {};

export default ResetPassword;
