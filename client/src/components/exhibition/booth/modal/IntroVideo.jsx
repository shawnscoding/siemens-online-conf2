import React, { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { sendTimeStamp } from "../../../../utils/helper";

const IntroVideo = ({ boothInfo, onClose, user }) => {
  React.useEffect(() => {
    if (user && boothInfo.idx) {
      const data = {
        company_idx: boothInfo.idx,
        user_idx: user.idx,
        user_action_type: "WATCH",
      };
      sendTimeStamp(data, "/userActionInBooth");
    }
  }, [boothInfo, user]);
  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Introduction Video</h2>
              <button type="button" className="close" onClick={onClose}>
                close
              </button>
            </div>
            <div
              className="pop-content"
              style={{
                padding: "4rem 0",
              }}
            >
              <div className="content-box" style={{ height: "100%" }}>
                <ReactPlayer
                  url={boothInfo.vod_action_url}
                  playing
                  loop
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroVideo;
