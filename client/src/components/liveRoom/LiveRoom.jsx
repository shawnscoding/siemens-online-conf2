import React, { useContext, useState, useRef } from "react";
import { Redirect, useParams } from "react-router-dom";
import { AuthContext } from "../../store/auth/AuthContext";
import define, { CDN_HOST } from "../../config/define";
import VodModal from "./VodModal";
import useResize from "../../hooks/useResize";
import { apiClient } from "../../utils/data/api";
import { sendTimeStamp } from "../../utils/helper";
const classes = {
  leave: {
    position: "fixed",
    top: "80rem",
    left: "162rem",
    padding: "7px 32px",
    fontSize: "20px",
    backgroundColor: "#fff",
    borderRadius: "6%",
  },
  icon: {
    fontSize: "29px",
  },
  background: {
    position: "absolute",
    zIndex: "-1",
  },
  screen: {
    fontSize: "25px",
    position: "absolute",
    width: "595px",
    height: "335px",
    display: "block",
    backgroundColor: "rgb(0,0,0)",
    transformOrigin: "left top 0px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 662, 297, 0, 1)",
  },
  replayBtn: {
    position: "absolute",
    width: "30rem",
    height: "4.8rem",
    fontSize: "20px",
    borderRadius: "6%",
    backgroundColor: "#31316f",
    color: "white",
    transformOrigin: "left top 0px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 830, 800, 0, 1)",
  },
};

const LiveRoomComponent = () => {
  const mainWrapRef = useRef(null);
  const { contentWrapStyle, contentResizeStyle } = useResize(mainWrapRef);

  // const { selectedCoverImg, isCurrentConference } = sessionInfo;
  // const { sendTimeStamp } = timestamp;
  const [streamingOpen, setStreamingOpen] = useState(false);
  const { session_code } = useParams();
  const [session, setSession] = useState(null);

  React.useEffect(() => {
    const getSessionList = async () => {
      try {
        // console.log("session_code ::", session_code);
        const sessionResponse = await apiClient.get(`/session/${session_code}`);
        const _session = sessionResponse.data[0];

        console.log("sessionResponse ::", sessionResponse);
        // if (!Array.isArray(_session) || !_session.length) return;
        setSession(_session);

        setTimeout(() => {
          handleToggleStreaming(true);
        }, 500);
        // const currentCoverImg = getCurrentItem(session[0].coverList);
        // setSelectedCoverImg(currentCoverImg || {});
      } catch (error) {
        console.error("session Provider useCallback error :", error);
      }
    };

    getSessionList();
  }, [session_code]);

  React.useEffect(() => {
    if (session && session.conference[0]) {
      const data = {
        conference_idx: session.conference[0].idx,
      };
      sendTimeStamp(data, "/userConferenceHistory");
    }
  }, [session]);

  const handleToggleStreaming = () => {
    setStreamingOpen((prev) => !prev);
  };

  const reopenVodModal = () => {
    setStreamingOpen(false);

    setTimeout(() => {
      setStreamingOpen(true);
    }, 1500);
  };

  // console.log("[LiveRoom ] rendered");

  let cover_url;
  if (session) cover_url = `${CDN_HOST}${session.cover_url}`;
  else
    cover_url =
      "https://siemens-evavconference-api.govent.io/resources/cover/cover_day1.jpg";
  return (
    <>
      <div
        className="mainConference__wrapper"
        ref={mainWrapRef}
        style={contentWrapStyle}
      >
        <div style={contentResizeStyle}>
          <img
            alt="메인 컨퍼런스 강의 썸네일"
            src={define.RESOURCE.MAIN_CONFERENCE_BG}
            className="mainConference__background"
            style={classes.background}
          />
          <button
            type="button"
            className="black-screen"
            style={classes.screen}
            onClick={handleToggleStreaming}
          >
            <img
              alt="커버 이미지"
              src={cover_url}
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                width: "100%",
                height: "100%",
              }}
            />
          </button>
        </div>
      </div>
      {session && (
        <VodModal
          reopenVodModal={reopenVodModal}
          session={session}
          handleClose={handleToggleStreaming}
          open={streamingOpen}
        />
      )}
    </>
  );
};
const LiveRoom = () => {
  // console.log("rendered");
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (!loading && !isAuthenticated) return <Redirect to="/" />;

  return <LiveRoomComponent />;
};

export default LiveRoom;
