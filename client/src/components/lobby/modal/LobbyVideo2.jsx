import React, { useContext, useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { LobbyContext } from "../../../store/lobby/LobbyContext";

const LobbyVideo2 = () => {
  const {
    setModalManager,
    lobbyDatas: { lobbyVod2 },
  } = useContext(LobbyContext);

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      lobbyVideo2: {
        open: false,
      },
    }));
  };

  return (
    <div className="popup modal">
      <div className="pop-tb videochat">
        {/* <!-- zoomIn은 팝업 띄우는 애니메이션 --> */}
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>SIMCENTER FOR SIMROD</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div
              className="pop-content"
              style={{ height: "calc(100% - 10rem)" }}
            >
              <div className="content-box" style={{ height: "100%" }}>
                <ReactPlayer
                  url={lobbyVod2.action_url}
                  playing
                  loop
                  controls
                  width={"100%"}
                  height={"100%"}
                  volume={1.0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyVideo2;
