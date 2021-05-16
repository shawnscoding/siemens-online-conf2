import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { CDN_HOST } from "../../../config/define";
import { LobbyContext } from "../../../store/lobby/LobbyContext";

const ExhibitionIntroModal = () => {
  const {
    setModalManager,
    lobbyDatas: { sponsor },
  } = useContext(LobbyContext);
  const history = useHistory();
  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      exhibition: {
        open: false,
      },
    }));
  };

  const getToExhibition = (params) => {
    handleClose();
    history.push(`/exhibition/${params}`);
    return "";
  };
  // console.log(process.env.NODE_ENV);

  return (
    <>
      <div className="popup modal on">
        <div className="pop-tb">
          <div className="pop-cell zoomIn">
            <div className="modal-box exhibition-modal-box">
              <div className="modal-header">
                <h2>참가 스폰서사 전시관</h2>
                <button onClick={handleClose} type="button" className="close">
                  close
                </button>
              </div>
              <div
                style={{
                  overflowY: "hidden",
                }}
                className="pop-content exhibition-content"
              >
                <div className="content-box exhibition-box">
                  {sponsor && (
                    <img
                      className="exhibition-img"
                      alt="후원사 목록 이미지"
                      src={`${CDN_HOST}${sponsor.cover_url}`}
                    />
                  )}
                  <div className="btn-event exhibition-btn">
                    <button onClick={() => getToExhibition("1")} type="button">
                      플래티넘
                    </button>
                    <button onClick={() => getToExhibition("2")} type="button">
                      골드
                    </button>
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

export default ExhibitionIntroModal;
