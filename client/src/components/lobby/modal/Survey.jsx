import React, { useContext, useEffect, useRef } from "react";
import { LobbyContext } from "../../../store/lobby/LobbyContext";

const Survey = () => {
  const {
    setModalManager,
    lobbyDatas: { survey },
  } = useContext(LobbyContext);
  const iframe = useRef(null);

  useEffect(() => {
    if (survey) {
      const close = () => {
        iframe.parentNode.removeChild(iframe);
      };
      iframe.current.addEventListener("CloseIframe", close);
      return () => {
        iframe.current.removeEventListener("CloseIframe", close);
      };
    }
  }, [survey]);

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      survey: {
        open: false,
      },
    }));
  };

  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Survey</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content" style={{ padding: "0" }}>
              <div className="content-box" style={{ height: "100%" }}>
                {survey ? (
                  <iframe
                    ref={iframe}
                    title="khc_survey"
                    src={survey.action_url}
                    frameBorder="0"
                    width="100%"
                    height="100%"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
