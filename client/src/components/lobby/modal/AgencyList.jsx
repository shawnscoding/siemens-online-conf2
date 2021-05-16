import React, { useContext } from "react";

import { LobbyContext } from "../../../store/lobby/LobbyContext";

const AgencyList = () => {
  // need to call server api
  const {
    modalManager: { agencyList },
    setModalManager,
  } = useContext(LobbyContext);
  const { open } = agencyList;

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      agencyList: {
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
              <button type="button" className="prev">
                prev
              </button>
              <h2>Agency List</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content">
              <div className="content-box">AgencyList</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyList;
