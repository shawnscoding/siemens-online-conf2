import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { apiClient } from "../../utils/data/api";
import { AuthContext } from "../../store/auth/AuthContext";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";

const Btn = styled.button`
  height: 46px !important;
  padding: 0 !important;
  cursor: ${(props) =>
    props.disable === true ? "default" : "pointer"} !important;
`;

const StyledCircularProgress = styled(CircularProgress)`
  width: 30px !important;
  height: 30px !important;
  color: #fff !important;
`;

const LoginCloseBtn = styled.button`
  position: absolute;
  z-index: 10;
  right: 3px;
  top: 8px;
  color: inherit;
  cursor: pointer;
`;

const StyledCloseIcon = styled(CloseIcon)`
  width: 30px !important;
  height: 30px !important;
  color: #d4d4d4;
`;

const LoginForm = ({ goToRegister, goToResetPassword, onCloseModal }) => {
  const { onLogin } = useContext(AuthContext);
  const history = useHistory();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState(null);
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChangeStaySignIn = () => {
    setStaySignedIn((prev) => !prev);
  };

  const handleChange = (e) => {
    let value = e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleLogin = () => {
    const { email, password } = form;
    console.log("clciked ! ");
    setLoading(true);

    apiClient
      .post("/auth/login", { email, password })
      .then((response) => {
        const { token, user } = response.data;

        onLogin({ newToken: token, loggedUser: user });
        if (staySignedIn) localStorage.setItem("staySignedIn", true);
        setLoading(false);
        history.push({ pathname: "/lobby", state: { referrer: "/login" } }); // referrer 넘겨서 로그인 이후 공지사항 팝업에 사용한다.
      })
      .catch((error) => {
        const msg = error.response.data.error;
        setErrMsg(msg);
        setLoading(false);
      });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div className="popup" style={{ position: "fixed" }}>
        <div className="popup__tb">
          <div className="popup__cell zoomIn login">
            <div style={{ position: "relative" }} className="loginbox">
              <LoginCloseBtn
                type="button"
                className="login__close-btn"
                title="Close"
                onClick={onCloseModal}
              >
                <StyledCloseIcon />
              </LoginCloseBtn>

              <div className="loginbox__header login">
                <h2 className="loginbox__logobox logo3">
                  2020 Autumn Conference
                  <br />
                  for Talent Management
                  <br />
                </h2>
              </div>
              <div className="loginbox__content">
                <p className="login__help-msg">
                  아직 계정이 없으시면 '행사등록'을 진행해 주세요
                </p>
                <ul className="loginbox__form">
                  <li className="loginbox__item">
                    <label>
                      <span style={{ width: "15%" }}>email</span>
                      <input
                        placeholder="이메일을 입력해주세요"
                        className="loginbox__input"
                        style={{ width: "85%" }}
                        type="text"
                        title="email"
                        value={form.email}
                        name="email"
                        onChange={handleChange}
                      />
                    </label>
                  </li>
                  <li className="loginbox__item">
                    <label>
                      <span
                        className="loginbox__ipttxt"
                        style={{ width: "15%" }}
                      >
                        pw
                      </span>
                      <input
                        placeholder="비밀번호를 입력해주세요"
                        className="loginbox__input"
                        style={{ width: "85%" }}
                        value={form.password}
                        type="password"
                        title="password"
                        name="password"
                        onKeyDown={handleKeyDown}
                        onChange={handleChange}
                      />
                    </label>
                  </li>
                </ul>
                <div className="loginbox__ipt">
                  <p className="loginbox__staysign">
                    <label className="checkbox">
                      <input
                        checked={staySignedIn}
                        onChange={handleChangeStaySignIn}
                        className="checkbox__input"
                        type="checkbox"
                      />
                      <span className="checkbox__txt loginbox__ipttxt">
                        로그인 유지
                      </span>
                    </label>
                  </p>
                  <div className="loginbox__find">
                    <p className="loginbox__find_id">
                      <button
                        onClick={goToRegister}
                        type="button"
                        className="loginbox__ipttxt"
                      >
                        행사등록
                      </button>
                    </p>
                    <p className="loginbox__find_pw">
                      <button
                        onClick={goToResetPassword}
                        type="button"
                        className="loginbox__ipttxt"
                      >
                        PW 찾기
                      </button>
                    </p>
                  </div>
                </div>
                <div className="popbtn">
                  {errMsg && <div className="popbtn__error">{errMsg}</div>}
                  <Btn
                    onClick={handleLogin}
                    disabled={loading}
                    disable={loading}
                    title="Login"
                    type="button"
                    className="popbtn__button"
                  >
                    {loading ? <StyledCircularProgress /> : "로그인"}
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
