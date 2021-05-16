import React, { useState } from "react";
import StarRatingModal from "./StarRatingModal";
import { apiClient } from "../../utils/data/api";
import { determinePlayPoint } from "../../utils/vimeo";
import RefreshIconComponent from "@material-ui/icons/Refresh";
import styled from "styled-components";
// const currentConference = {
//   action_url:
//     // "https://player.vimeo.com/video/522194871?title=0&byline=0&portrait=0&playsinline=0&autoplay=1&autopause=0&controls=0&loop=1&app_id=122963",
//     "https://player.vimeo.com/video/523628304?autoplay=1&autopause=0&controls=0",
//   idx: 2,
//   title_ko: "컨퍼런스 테스트 VOD",
// };

// const currentConference = {
//   action_url:
//     // "https://player.vimeo.com/video/522194871?title=0&byline=0&portrait=0&playsinline=0&autoplay=1&autopause=0&controls=0&loop=1&app_id=122963",
//     "https://player.vimeo.com/video/528091426?autoplay=1&autopause=0",
//   idx: 2,
//   title_ko: "컨퍼런스 테스트 VOD",
// };

const ReopenModalBtn = styled.button`
  left: 1.5rem;
  text-indent: initial !important;
`;

const RefreshIcon = styled(RefreshIconComponent)`
  width: 45px !important;
  height: 45px !important;
  color: #a9a9a9 !important;
`;

const VodModal = ({ handleClose, session, open, reopenVodModal }) => {
  const [starReviewModal, setStarReviewModal] = React.useState({ open: false });

  const currentConference = session.conference[0];

  const onClose = () => {
    setStarReviewModal((prev) => ({
      ...prev,
      open: true,
    }));
  };

  const handleReviewClose = () => {
    setStarReviewModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // console.log("[VodModal ] rendered", moment().format());

  const [goventioToken, setGoventioToken] = useState("");
  const getGoventioToken = async (currentConference) => {
    try {
      if (currentConference.idx === 104) currentConference.idx = 106;
      // this is client's special request
      const res = await apiClient.post("/goventio/comment", {
        roomType: "QA",
        roomCode: currentConference.idx,
        roomTitle: currentConference.title_ko,
      });
      console.log("res ::", res);
      const { data } = res;
      setGoventioToken(data.token);
    } catch (error) {
      console.error("post booth chat waiting form error:  ", error);
    }
  };

  React.useEffect(() => {
    if (currentConference) {
      getGoventioToken(currentConference);
    }
  }, [currentConference]);

  if (!open) return <></>;
  return (
    <>
      {starReviewModal.open && (
        <StarRatingModal
          handleClose={handleReviewClose}
          handleVodClose={handleClose}
          currentConference={currentConference}
        />
      )}
      <div className="popup modal video">
        <div
          style={{
            maxWidth: "173.5rem",
          }}
          className="pop-tb videochat"
        >
          <div className="pop-cell zoomIn">
            <div
              className="modal-box"
              style={{
                backgroundColor: "#fff",
              }}
            >
              <div className="modal-header">
                <ReopenModalBtn
                  type="button"
                  title="Reopen"
                  onClick={reopenVodModal}
                >
                  <RefreshIcon />
                </ReopenModalBtn>
                <h2
                  style={{
                    fontSize: "3rem",
                    color: "#000",
                    backgroundColor: "#fff",
                  }}
                >
                  SIEMENS LIVE Session
                </h2>

                <button type="button" className="close" onClick={onClose}>
                  close
                </button>
              </div>
              <div className="pop-content pop-chat">
                <div className="modal-msg siemens">
                  영상 멈춤, 끊김 현상 발생 시, 팝업창 좌측 새로고침 버튼을
                  눌러주세요. / 전체 화면 단축키 : F
                </div>
                <div className="content-box siemens">
                  <div className="video-play video-chat">
                    <ul>
                      <li
                        style={{
                          width: "75%",
                        }}
                      >
                        <div
                          className="video"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            maxHeight: "655px",
                            height: "100%",
                          }}
                        >
                          <iframe
                            src={determinePlayPoint(
                              currentConference,
                              session.open_datetime
                            )}
                            // src={currentConference.action_url}
                            frameBorder="0"
                            allow="camera; microphone; autoplay"
                            allowFullScreen
                            width="100%"
                            height="100%"
                          />
                        </div>
                      </li>
                      <li style={{ width: "25%" }} className="chat_wrap">
                        {goventioToken && (
                          <iframe
                            style={{ width: "100%", height: "100%" }}
                            src={`https://comment.govent.io/?token=${goventioToken}`}
                          />
                        )}
                      </li>
                    </ul>
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

export default VodModal;
