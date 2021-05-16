import React from "react";
import { trackLabelDic } from "./LiveRoomListModal";

const LiveRoomHeader = ({ page, onPrev, onClose, list }) => {
  if (page === 1)
    return (
      <div className="modal-header">
        <h2>LIVE CONFERENCE HALL</h2>
        <button onClick={onClose} className="close">
          close
        </button>
      </div>
    );

  if (!list)
    return (
      <div className="modal-header">
        {page === 2 && (
          <button type="button" onClick={onPrev} className="prev">
            prev
          </button>
        )}
        <h2>LIVE CONFERENCE HALL</h2>
        <button onClick={onClose} className="close">
          close
        </button>
      </div>
    );
  const trackLabel = trackLabelDic[list[0].track_code.slice(0, 2)];
  return (
    <div className="modal-header">
      {page === 2 && (
        <button type="button" onClick={onPrev} className="prev">
          prev
        </button>
      )}
      <h2>
        <span
          style={{
            fontSize: "3.4rem",
          }}
          className="span-track1"
        >
          {trackLabel}
        </span>
        {list[0].title}
      </h2>
      <button onClick={onClose} className="close">
        close
      </button>
    </div>
  );
};

export default LiveRoomHeader;
