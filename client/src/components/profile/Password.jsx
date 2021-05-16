import React, { useState, useContext } from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { apiClient } from "../../utils/data/api";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import styled from "styled-components";

const Btn = styled.button`
  background-color: ${(props) =>
    props.disabled ? "#d0d0d0" : "#0cc"} !important;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")} !important;
  transition: background-color 200ms ease;
`;

const PassWord = () => {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const { currentPassword, newPassword, newPasswordConfirm } = password;
  const [message, setErrInfo] = useState("");
  const { setModalManager } = useContext(LobbyContext);

  const validate = async () => {
    // const { currentPassword, newPassword, newPasswordConfirm } = password;
    // 현재 비밀번호 확인
    try {
      if (!currentPassword) {
        setErrInfo("비밀번호를 입력해주세요");
        return false;
      }

      if (newPassword !== newPasswordConfirm) {
        setErrInfo("새 비밀번호가 일치하지 않습니다");
        return false;
      }

      if (currentPassword === newPassword) {
        setErrInfo("새 비밀번호가 기존 비밀번호와 동일합니다");
        return false;
      }

      // return true;
      const data = {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      };
      const res = await apiClient.post("/register/changePassword", data);
      if (res.data) {
        return true;
      }
    } catch (error) {
      // todo error 핸들링
      console.log("register/resetPassword error :", error.response.data);
      const code = error.response.data.code;

      if (code === 2004) {
        setErrInfo("현재 비밀번호가 일치하지 않습니다");
      }

      return false;
    }
  };

  const onNewPassWordSubmit = async () => {
    const result = await validate();
    if (result) {
      setModalManager((prev) => ({
        ...prev,
        alert: {
          open: true,
          msg: "비밀번호 변경이 완료되었습니다.",
          header: "",
        },
      }));
    }
  };

  const onKeyUp = (e) => {
    const { id, value } = e.target;
    if (value) setErrInfo(() => "");
    setPassword((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  return (
    <Box mt={8}>
      <Typography variant="h3" gutterBottom>
        <span>비밀번호 변경</span>
      </Typography>
      <div>
        <dl>
          <dt>현재 비밀번호</dt>
          <dd>
            <input
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호"
              onKeyUp={onKeyUp}
            />
          </dd>
        </dl>
        <dl>
          <dt>새 비밀번호</dt>
          <dd>
            <input
              id="newPassword"
              type="password"
              placeholder="새 비밀번호"
              onKeyUp={onKeyUp}
            />
          </dd>
        </dl>
        <dl>
          <dt>새 비밀번호 확인</dt>
          <dd>
            <input
              id="newPasswordConfirm"
              type="password"
              placeholder="새 비밀번호 확인"
              onKeyUp={onKeyUp}
            />
          </dd>
        </dl>
      </div>
      <Grid container justify="center">
        <div className="btn-password">
          <Btn
            disabled={
              !currentPassword.length ||
              !newPassword.length ||
              !newPasswordConfirm.length
            }
            id="send_btn"
            onClick={onNewPassWordSubmit}
          >
            저장
          </Btn>
        </div>
      </Grid>
      <Grid>
        <p style={{ textAlign: "center" }}>{message}</p>
      </Grid>
    </Box>
  );
};

export default PassWord;
