import React from "react";
import styled from "styled-components";
import { CDN_HOST } from "../../../config/define";

const CloseBtn = styled.button`
  right: 2rem !important;
  background-size: 80% !important;
`;

const ModalContainer = styled.div`
  max-width: 49rem !important;

  @media only screen and (max-width: 500px) {
    margin: 0 !important;
    max-width: none !important;
  }
`;

const Img = styled.img`
  width: 100%;
`;

const Grid = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const BtnBox = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CheckBoxText = styled.p`
  margin-right: 6px;
  margin-top: 3px;
`;

const WelcomeMsgModal = ({ onClose, onClick }) => {
  const checkboxEl = React.useRef(null);
  // useRef is used for getting checkbox checked state
  return (
    <div className="popup modal on">
      <ModalContainer className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Welcome Message</h2>
              <CloseBtn
                type="button"
                className="close"
                onClick={() => onClose(checkboxEl)}
              >
                close
              </CloseBtn>
            </div>
            <div className="pop-content" style={{ padding: "0" }}>
              <div className="content-box" style={{ height: "100%" }}>
                <Img
                  src={`${CDN_HOST}/resources/cover/welcom_popup_cover_img.jpg`}
                  alt="웰컴 메세지 커버 이미지"
                />
                <Grid>
                  <CheckBoxText>오늘 하루 그만 보기</CheckBoxText>
                  <p
                    style={{
                      marginRight: 20,
                    }}
                    className="loginbox__staysign"
                  >
                    <label className="checkbox">
                      <input
                        ref={checkboxEl}
                        className="checkbox__input"
                        type="checkbox"
                      />
                      <span className="checkbox__txt loginbox__ipttxt"></span>
                    </label>
                  </p>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default WelcomeMsgModal;
