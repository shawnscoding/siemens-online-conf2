import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { AuthContext } from "../../store/auth/AuthContext";
import { apiClient } from "../../utils/data/api";
import { LobbyContext } from "../../store/lobby/LobbyContext";

const NetworkPrivayAgreement = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setModalManager } = useContext(LobbyContext);
  const { is_agreed_network_policy } = user;
  const [isAgreed, setIsAgreed] = React.useState(
    is_agreed_network_policy || ""
  );
  useEffect(() => {
    const fetchUser = async () => {
      const res = await apiClient.get("/me");
      setUser(res.data);
    };
    fetchUser();
  }, []);

  const send = async () => {
    try {
      const result = await apiClient.post("/register/updateIsAgreedPolicy", {
        is_agreed_network_policy: isAgreed,
      });
      const { status } = result;

      if (status === 200) {
        const _msg =
          isAgreed === "Y"
            ? "저장되었습니다. \n 이제 네트워킹 라운지에서 \n 명함 정보가 공개됩니다."
            : "저장되었습니다. \n 이제 네트워킹 라운지에서 \n 명함 정보가 공개되지 않습니다.";
        setModalManager((prev) => ({
          ...prev,
          alert: {
            header: "Alert",
            msg: _msg,
            open: true,
          },
        }));
        setUser({
          ...user,
          is_agreed_network_policy: isAgreed,
        });
      }
    } catch (error) {
      console.error("update agreement policy error : ", error);
      console.error("errorresponse : ", error.response);
    }
  };

  const setIsAgreedPolicy = (agreed) => {
    setIsAgreed(agreed);
  };

  return (
    <Box mt={8} className="inputAgreement">
      <Typography variant="h3" gutterBottom>
        <span>네트워킹 라운지 정보 공개 동의서</span>
      </Typography>
      <br />
      <div>
        <div className="messge-box">
          <p style={{ fontWeight: "600" }}>
            네트워킹 라운지 개인정보 공개 동의서​
          </p>
          <br />
          <br />
          &nbsp; 귀하의 개인정보를 2021 지멘스 전기차/자율주행차 기술 온라인
          컨퍼런스 플랫폼 네트워킹 라운지 내에서 타인이 조회 또는 열람하는 것에
          동의합니다.
          <br />
          <br />
          ※ 제공되는 개인정보 사항
          <br />
          - 이름, 소속, 직함, 연락처, 이메일 등
          <br />
          <br />
          네트워킹 라운지 개인정보 공개에 동의하지 않으실 수 있습니다. 다만,
          동의 거부 시 네트워킹 라운지 서비스 이용이 부분적으로 제한될 수
          있습니다 (다른 참가자에게 본인 정보를 제공하는 기능).
          <br />
          <br />
        </div>
        <div className="privacy form">
          <div className="agreement__input">
            <label className="radios" htmlFor="agree">
              <input
                className="radio-txt"
                id="agree"
                name="policy"
                type="radio"
                checked={isAgreed === "Y"}
                onChange={() => {
                  setIsAgreedPolicy("Y");
                }}
              />
              <span className="radio-text"> 동의합니다</span>
            </label>
          </div>
          <div>
            <label className="radios" htmlFor="disagree">
              <input
                className="radio-txt"
                id="disagree"
                name="policy"
                type="radio"
                checked={isAgreed == "N"}
                onChange={() => setIsAgreedPolicy("N")}
              />
              <span className="radio-text">동의하지 않습니다</span>
            </label>
          </div>
        </div>
        <div className="btn-password">
          <button id="send_btn" onClick={send}>
            저장
          </button>
        </div>
      </div>
    </Box>
  );
};

export default NetworkPrivayAgreement;
