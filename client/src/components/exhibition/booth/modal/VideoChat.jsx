import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { apiClient } from "../../../../utils/data/api";
import { sendTimeStamp } from "../../../../utils/helper";
import BoothWaitingList from "./BoothWaitingList";

const VideoChat = ({ boothInfo, setOpenMeeting, setBoothInfo, user }) => {
  // boothInfo : 있는 경우 -> Booth에서 입장한 경우, 없는 경우 -> 프로필에서 담당자가 입장한 경우

  React.useEffect(() => {
    if (user && boothInfo.idx) {
      const data = {
        company_idx: boothInfo.idx,
        user_idx: user.idx,
        user_action_type: "CALL",
      };
      sendTimeStamp(data, "/userActionInBooth");
    }
  }, [boothInfo, user]);

  const [openWaitingList, setOpenWaitingList] = useState(false);

  const [isMine, setIsMine] = useState(false);
  const [enterIdx, setEnterIdx] = useState("");
  const location = useLocation();
  const updateStatus = async (status) => {
    try {
      await apiClient.post("/company/status", {
        status,
      });

      // handleSetSrcByStatus(status);

      setBoothInfo((prev) => ({
        ...prev,
        status,
      }));
    } catch (error) {
      console.error("get stamp error", error);
    }
  };

  const checkManagerStatus = (manager) => {
    if (!manager.length) return false;
    return manager.findIndex((m) => m.email === user.email) > -1;
  };

  const sendJoinMeeting = async () => {
    try {
      return apiClient.post("/joinMeeting", {
        type: "enter",
        company_idx: location.pathname.split("/").pop(),
      });
    } catch (error) {
      console.error("sendJoinMeeting error", error);
    }
  };

  const sendExitMetting = () => {
    try {
      return apiClient.post("/joinMeeting", {
        type: "exit",
        enter_idx: enterIdx,
      });
    } catch (error) {
      console.error("sendExitMeeting error", error);
    }
  };

  const getMeetingEnterIndex = async () => {
    try {
      const { data } = await sendJoinMeeting();
      if (!data.enter_idx) return null;
      setEnterIdx(data.enter_idx);
    } catch (error) {
      console.error("getMeetingEnterIndex error ::", error);
    }
  };

  const close = async () => {
    if (enterIdx) sendExitMetting();
    setOpenMeeting(false);
  };

  useEffect(() => {
    if (boothInfo) {
      if (user.company_idx === boothInfo.idx) {
        setIsMine(true);
      }
      if (!checkManagerStatus(boothInfo.manager)) {
        getMeetingEnterIndex();
      }
    }
  }, [boothInfo]);

  // console.log(
  //   "[Video Chat Modal] :::::",
  //   `${boothInfo.meeting_url}&nick=${user.name}&email=${user.email}&host=${
  //     user.company_idx === boothInfo.idx ? "y" : "n"
  //   }&room=${boothInfo.idx}`
  // );

  if (!boothInfo) return <></>;
  return (
    <div className="popup modal video">
      <div className="pop-tb videochat">
        <div className="pop-cell zoomIn">
          <div
            className="modal-box"
            style={{
              backgroundColor: "#fff",
            }}
          >
            <div className="modal-header">
              <h2 className="video_title">
                화상 상담 -&nbsp;
                {boothInfo.name}
              </h2>
              <button type="button" className="close" onClick={close}>
                close
              </button>
            </div>
            <div
              className="pop-content pop-chat"
              style={{ height: "80rem", overflow: "hidden" }}
            >
              <div className="content-box bChat">
                <div className="bChat__taskbar">
                  {isMine && (
                    <>
                      <div className="bChat__state">
                        <>
                          <button
                            type="button"
                            className={`bChat__btn bChat__btn--open ${
                              boothInfo.status === "avail" ? "on" : null
                            }`}
                            onClick={() => {
                              updateStatus("avail");
                            }}
                          >
                            <span />
                            상담가능
                          </button>
                          <button
                            type="button"
                            className={`bChat__btn bChat__btn--full ${
                              boothInfo.status === "busy" ? "on" : null
                            }`}
                            onClick={() => {
                              updateStatus("busy");
                            }}
                          >
                            <span />
                            상담중
                          </button>
                          <button
                            type="button"
                            className={`bChat__btn bChat__btn--close ${
                              boothInfo.status === "away" ? "on" : null
                            }`}
                            onClick={() => {
                              updateStatus("away");
                            }}
                          >
                            <span />
                            부재중
                          </button>
                        </>
                      </div>
                      <button
                        type="button"
                        className="bChat__listbtn"
                        onClick={() => {
                          setOpenWaitingList(true);
                        }}
                      >
                        <span />
                        상담 신청 목록
                      </button>
                    </>
                  )}
                </div>

                <div className="vWrap">
                  <div style={{ height: "100%", width: "100%" }}>
                    <div
                      className="vCam__video"
                      style={{
                        height: "inherit",
                        backgroundColor: "#eee",
                        margin: "0 auto",
                      }}
                    >
                      <iframe
                        id="boothVideo"
                        title="booth meeting"
                        src={`${boothInfo.meeting_url}&nick=${
                          user.name
                        }&email=${user.email}&host=${
                          user.company_idx === boothInfo.idx ? "y" : "n"
                        }&room=${boothInfo.idx}`}
                        style={{ width: "100%", height: "100%" }}
                        allow="camera; microphone; autoplay"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* <div className="vChat on" style={{ width: "20%" }}>
                    {goventioToken && (
                      <iframe
                        style={{ width: "100%", height: "100%" }}
                        src={`https://comment.govent.io/?token=${goventioToken}`}
                      />
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openWaitingList ? (
        <BoothWaitingList setOpenWaitingList={setOpenWaitingList} />
      ) : null}
    </div>
  );
};

export default VideoChat;
