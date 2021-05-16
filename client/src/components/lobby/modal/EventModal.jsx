import React, { useContext, useRef } from "react";
import styled from "styled-components";
import { CDN_HOST, RESOURCE } from "../../../config/define";
import { LobbyContext } from "../../../store/lobby/LobbyContext";

// const Img = styled.img`
//   width: 384px;
//   background-size: contain;
//   background-repeat: no-repeat;
//   background-position: center;
// `;
const ModalContainer = styled.div`
  max-width: 49rem !important;

  @media only screen and (max-width: 500px) {
    margin: 0 !important;
    max-width: none !important;
  }
`;

const Btn = styled.button`
  width: 100%;
`;

const Img = styled.img`
  width: 100%;
`;

const EventModal = () => {
  const { setModalManager } = useContext(LobbyContext);

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      event: {
        open: false,
      },
    }));
  };

  return (
    <div className="popup modal on">
      <ModalContainer className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>EVENT</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content" style={{ padding: "0" }}>
              <div className="content-box" style={{ height: "100%" }}>
                <Img
                  src={`${CDN_HOST}/resources/cover/1.png`}
                  alt="event description"
                />
                <Btn
                  type="button"
                  onClick={() =>
                    window.open("https://forms.gle/UXHVkkaA48oyTXeW8", "_blank")
                  }
                >
                  <Img
                    src={`${CDN_HOST}/resources/cover/2.png`}
                    alt="event description"
                  />
                </Btn>
                <Img
                  src={`${CDN_HOST}/resources/cover/3.png`}
                  alt="event description"
                />
                {/* <Img
                  src={`${CDN_HOST}/resources/cover/3.png`}
                  alt="event description"
                /> */}
                <Btn
                  type="button"
                  onClick={() =>
                    window.open("https://forms.gle/FvPMpoYy94WeUFYt5", "_blank")
                  }
                >
                  <Img
                    src={`${CDN_HOST}/resources/cover/4.png`}
                    alt="event description"
                  />
                </Btn>

                <Img
                  src={`${CDN_HOST}/resources/cover/5.png`}
                  alt="event description"
                />
              </div>
            </div>
          </div>
        </div>
      </ModalContainer>
    </div>
  );
};

export default EventModal;
