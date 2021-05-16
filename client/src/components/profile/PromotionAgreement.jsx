import React, { useContext, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { AuthContext } from "../../store/auth/AuthContext";
import { apiClient } from "../../utils/data/api";
import { LobbyContext } from "../../store/lobby/LobbyContext";

const PromotionAgreement = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setModalManager } = useContext(LobbyContext);
  const { is_agreed_promotion } = user;
  const [isAgreed, setIsAgreed] = React.useState(is_agreed_promotion || "");
  React.useEffect(() => {
    const fetchUser = async () => {
      const res = await apiClient.get("/me");
      setUser(res.data);
    };
    fetchUser();
  }, []);

  const send = async () => {
    try {
      const result = await apiClient.post("/register/updateIsAgreedPromotion", {
        is_agreed_promotion: isAgreed,
      });
      const { status } = result;

      if (status === 200) {
        const msg = "저장되었습니다. \n 감사합니다";

        setModalManager((prev) => ({
          ...prev,
          alert: {
            header: "Alert",
            msg,
            open: true,
          },
        }));
        setUser({
          ...user,
          is_agreed_promotion: isAgreed,
        });
      }
    } catch (error) {
      console.error("update agreement promotion error : ", error);
      console.error("errorresponse : ", error.response);
    }
  };

  const setIsAgreedPolicy = (agreed) => {
    setIsAgreed(agreed);
  };

  return (
    <Box mt={8} className="inputAgreement">
      <Typography variant="h3" gutterBottom>
        <span>마케팅 및 광고 활용 동의(선택)</span>
      </Typography>
      <br />
      <div>
        <div className="messge-box">
          <p style={{ fontWeight: "600" }}>마케팅 및 광고 활용 동의(선택)</p>
          <br />
          <br />
          &nbsp; 2021 지멘스 전기차/자율주행차 기술 온라인 컨퍼런스 플랫폼에서
          제공하는 이벤트 및 서비스 안내(행사정보) 등 광고성 정보를 받으시려면
          마케팅 목적 이용에 동의하여 주시기 바랍니다
          <br />
          <br />
          ※ 이용 범위
          <br />
          당사 및 제휴사 상품 안내, 이벤트 등 광고성 정보 전달 및 참여기회 제공,
          회원 대상 각종 마케팅 활동
          <br />
          <br />
        </div>
        <div className="privacy form">
          <div className="agreement__input">
            <label className="radios" htmlFor="promotionAgree">
              <input
                className="radio-txt"
                id="promotionAgree"
                name="promotion"
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
            <label className="radios" htmlFor="promotionDisagree">
              <input
                className="radio-txt"
                id="promotionDisagree"
                name="promotion"
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

export default PromotionAgreement;
