import React, { useContext } from "react";
import { LobbyContext } from "../../../store/lobby/LobbyContext";

const Lounge = () => {
  // need to call server api
  const {
    modalManager: { lounge },
    setModalManager,
  } = useContext(LobbyContext);
  const { open } = lounge;

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      lounge: {
        open: false,
      },
    }));
  };

  if (!open) return <></>;
  return (
    <div className="popup modal on">
      <div className="pop-tb">
        {/* <!-- zoomIn은 팝업 띄우는 애니메이션 --> */}
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              {/* <button type="button" className="prev">
                prev
              </button> */}
              <h2>Lounge</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content">
              <div className="content-box">Lounge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lounge;
