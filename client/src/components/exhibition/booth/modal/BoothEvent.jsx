import React from "react";
import { sendTimeStamp } from "../../../../utils/helper";

const BoothEvent = ({ onClose, boothInfo, user }) => {
  React.useEffect(() => {
    if (user && boothInfo.idx) {
      const data = {
        company_idx: boothInfo.idx,
        user_idx: user.idx,
        user_action_type: "EVENT",
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
              <h2>Event</h2>
              <button type="button" className="close" onClick={onClose}>
                close
              </button>
            </div>
            <div className="pop-content" style={{ padding: "0" }}>
              <div className="content-box" style={{ height: "100%" }}>
                {boothInfo.survey_action_url && (
                  <iframe
                    title="khc_survey"
                    src={boothInfo.survey_action_url}
                    frameBorder="0"
                    width="100%"
                    height="100%"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothEvent;
