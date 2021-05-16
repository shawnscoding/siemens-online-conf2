import React, { useEffect, useRef, useState, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import IntroVideo from "./modal/IntroVideo";
import Overview from "./modal/Overview";
import Brochure from "./modal/Brochure";
import VideoChat from "./modal/VideoChat";
import define, { CDN_HOST } from "../../../config/define";
import { AuthContext } from "../../../store/auth/AuthContext";
import { apiClient } from "../../../utils/data/api";
import BoothChatRequestForm from "../../common/BoothChatRequestForm";
import BoothEvent from "./modal/BoothEvent";
import useResize from "../../../hooks/useResize";
import styled from "styled-components";
import { getParticipants, isEmpty } from "../../../utils/helper";

const EventPopper = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  font-size: 3.2rem;
  transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 473, 756, 0, 1);
  transform-origin: left top 0px;
  color: #1e4eff;
  -webkit-transition: background-color 130ms ease;
  transition: background-color 130ms ease;
`;

const classes = {
  companyName: {
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 665, 81, 0, 1)",
    position: "absolute",
    top: "0",
    left: "0",
    width: "800px",
    height: "135px",
    lineHeight: "135px",
    textAlign: "center",
    fontSize: "6rem",
    fontWeight: "bold",
  },
  post: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "271px",
    height: "154px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 464, 399, 0, 1)",
    backgroundImage:
      "url('https://d5htgy75wwfze.cloudfront.net/company/eh1_01/poster.png')",
    backgroundSize: "cover",
  },
  vod: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "10px",
    height: "10px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 834, 422, 0, 1)",
    transformOrigin: "left top 0px",
    color: "transparent",
  },
  brochure: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "10px",
    height: "10px",
    transform:
      "matrix3d(12.5, -1, 0, 0, 1, 34.5, 0, 0, 0, 0, 1, 0, 1453, 644, 0, 1)",
    transformOrigin: "left top 0px",
    color: "transparent",
  },
  qaChat: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "10px",
    height: "10px",
    transform: "matrix3d(7, 0, 0, 0, 0, 7, 0, 0, 0, 0, 1, 0, 445, 600, 0, 1)",
    transformOrigin: "left top 0px",
    color: "transparent",
  },
  status: {
    position: "absolute",
    left: "0",
    top: "0",
    width: "10px",
    height: "10px",
    transform: "matrix3d(10, 0, 0, 0, 0, 15, 0, 0, 0, 0, 1, 0, 732, 796, 0, 1)",
    transformOrigin: "left top 0px",
    color: "transparent",
  },
  exit: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "10px",
    height: "10px",
    transform: "matrix3d(8, 0, 0, 0, 0, 8, 0, 0, 0, 0, 1, 0, 1620, 910, 0, 1)",
    transformOrigin: "left top 0px",
    backgroundColor: "#2e315d",
    color: "white",
    borderRadius: "50%",
  },
};

const Booth = ({ match }) => {
  const histroy = useHistory();
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const contentWrapRef = useRef(null);
  const { contentWrapStyle, contentResizeStyle } = useResize(contentWrapRef);
  const { params } = match;
  const { id } = params;
  const [boothInfo, setBoothInfo] = useState({});
  const [statusSrc, setStatusSrc] = useState("");
  const [name, setModalName] = useState("");
  const [openMeeting, setOpenMeeting] = useState(false);
  const [openBoothChatRequestForm, setOpenBoothChatRequestForm] = useState(
    false
  );

  const [event, setEvent] = React.useState({ open: false });

  const toggleBoothEvent = () => {
    setEvent((prev) => ({ open: !prev.open }));
  };

  const getBackToExhibition = () => {
    if (boothInfo.location) {
      histroy.push(`/exhibition/${boothInfo.location}`);
    }
  };

  const openChat = async () => {
    try {
      if (boothInfo && boothInfo.idx) {
        // 기업 담당자
        const res = await getParticipants(boothInfo);
        const { users } = res.data;
        // console.log("res in openChat ::", res);
        if (boothInfo.idx === user.company_idx) {
          if (users.length <= 1) return setOpenMeeting(true);
        }
        // 일반 유저
        if (boothInfo.status === "avail") {
          // if they're talking
          if (users.length > 1) {
            // console.log("they're talking");
            setOpenBoothChatRequestForm(true);
            return;
          }
          const managerObj = {};
          for (const item of boothInfo.manager) {
            managerObj[item.email] = true;
          }
          // console.log("managerObj :: ", managerObj);
          let managerInRoom = false;
          for (const item of users) {
            if (managerObj[item.email]) {
              managerInRoom = true;
              break;
            }
          }

          // console.log("managerInRoom :: ", managerInRoom);

          // if host is in room, allow entering
          if (managerInRoom) setOpenMeeting(true);
          else {
            // console.log("no manager in room now");
            setOpenBoothChatRequestForm(true);
          }
        } else if (boothInfo.status === "busy") {
          // this is user's selection
          setOpenBoothChatRequestForm(true);
        } else if (boothInfo.status === "away") {
          // this is user's selection
          setOpenBoothChatRequestForm(true);
        }
      }
    } catch (error) {
      console.log("booth open chat Error ::", error);
    }
  };

  useEffect(() => {
    const getCompany = async () => {
      const { data } = await apiClient.get(`/company/${params.id}`);
      const { brochure_cover_url_01, brochure_action_url_01 } = data[0];
      // merge action_url and cover_url for array mapping
      if (!isEmpty(brochure_cover_url_01) && !isEmpty(brochure_action_url_01)) {
        const brochure_cover_url_list = brochure_cover_url_01.split(",");
        const brochure_action_url_list = brochure_action_url_01.split(",");
        const brochure_list = [];
        if (
          brochure_cover_url_list.length === brochure_action_url_list.length
        ) {
          for (let i = 0; i < brochure_cover_url_list.length; i++) {
            brochure_list.push({
              brochure_cover_url: brochure_cover_url_list[i],
              brochure_action_url: brochure_action_url_list[i],
            });
          }

          data[0].brochure_list = brochure_list;
        }
      }
      setBoothInfo(data[0]);
    };

    const postStamp = async () => {
      try {
        apiClient.post("/stamp", {
          company_idx: params.id,
        });
      } catch (error) {
        console.error("get stamp error", error);
      }
    };

    postStamp();
    getCompany();
  }, [params.id]);

  const handleSetSrcByStatus = (_status) => {
    if (_status === "busy") {
      setStatusSrc(define.RESOURCE.STATUS_BUSY);
    } else if (_status === "away") {
      setStatusSrc(define.RESOURCE.STATUS_AWAY);
    } else if (_status === "avail") {
      setStatusSrc(define.RESOURCE[`STATUS_AVAIL`]);
    }
  };

  React.useEffect(() => {
    if (boothInfo && Object.keys(boothInfo)) {
      const setBoothChatStatusSrc = async () => {
        try {
          const { manager, status } = boothInfo;
          // console.log("status ::: ", status);
          const res = await getParticipants(boothInfo);
          if (res) {
            const { users } = res.data;
            // console.log("res in useEffect ::", res);

            const managerObj = {};
            for (const item of manager) {
              managerObj[item.email] = true;
            }
            // console.log("managerObj :: ", managerObj);
            let isManagerInRoom = false;
            for (const item of users) {
              if (managerObj[item.email]) {
                isManagerInRoom = true;
                break;
              }
            }

            // if there's no manager
            if (!isManagerInRoom || status === "away") {
              // console.log("called no manager !! ");
              handleSetSrcByStatus("away");
              return;
            }

            // if they're talking
            if (users.length === 2 || status === "busy") {
              // console.log("called they're talking !! ");
              handleSetSrcByStatus("busy");
              return;
            }

            handleSetSrcByStatus("avail");
          }
        } catch (error) {
          console.error("setBoothChatStatusSrc error ::", error);
        }
      };

      setBoothChatStatusSrc();
    }
  }, [boothInfo]);

  if (!loading && !isAuthenticated) return <Redirect to="/" />;
  // if (Object.keys(boothInfo).length !== 0) return <></>;

  return (
    <>
      {event.open && boothInfo.idx && (
        <BoothEvent
          onClose={toggleBoothEvent}
          boothInfo={boothInfo}
          user={user}
        />
      )}
      <div className="booth wrapper">
        <div className="content-wrap" style={contentWrapStyle}>
          <div
            className="canvas-wrap"
            ref={contentWrapRef}
            style={contentResizeStyle}
          >
            <img
              alt="부스 배경 화면"
              src={define.RESOURCE.BOOTH_BACKGROUND}
              className="booth__background"
            />
            <button
              className="company-logo-btn"
              type="button"
              style={{
                backgroundImage: `url(${CDN_HOST}${boothInfo.logo_url})`,
                backgroundSize: "cover",
              }}
              onClick={() => window.open(boothInfo.homepage_url)}
            >
              홈페이지로 이동
            </button>

            {boothInfo.location === 1 && (
              <EventPopper type="button" onClick={toggleBoothEvent}>
                <img
                  src={`${CDN_HOST}/assets/booth/booth_event.png`}
                  alt="이벤트 참여하기"
                />
              </EventPopper>
            )}
            <div
              style={{
                ...classes.companyName,
              }}
            >
              {boothInfo.name}
            </div>

            {boothInfo.post_url ? (
              <div
                style={{
                  ...classes.post,
                  backgroundImage: `url("${CDN_HOST}${boothInfo.post_url}")`,
                }}
              />
            ) : null}

            <div style={classes.vod}>
              {boothInfo.vod_action_url ? (
                <>
                  <ReactPlayer
                    url={boothInfo.vod_action_url}
                    loop
                    playing
                    muted
                    width="434px"
                    height="243px"
                    style={{
                      position: "absolute",
                      zIndex: 1000000,
                      cursor: "pointer",
                      backgroundColor: "black",
                    }}
                  />
                  <div
                    className="video-inner"
                    style={{
                      position: "relative",
                      width: "434px",
                      height: "243px",
                      zIndex: "99999999",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setModalName("intro");
                    }}
                  />
                </>
              ) : boothInfo.vod_cover_url ? (
                <img
                  alt="vod_cover"
                  src={boothInfo.vod_cover_url}
                  style={{ width: "434px", height: "243px" }}
                />
              ) : null}
            </div>

            <button
              id="brochure"
              type="button"
              style={{
                ...classes.brochure,
              }}
              onClick={() => setModalName("brochure")}
            >
              브로셔
            </button>

            {/* <button type="button" onClick={openChat}>
              <img
                src={define.RESOURCE.ICON_QUESTION}
                alt="qa chat 아이콘"
                style={{
                  ...classes.qaChat,
                  position: "absolute",
                  left: "0",
                  top: "0",
                }}
              />{" "}
            </button> */}

            {/* {statusSrc ? (
              <button type="button" title="Open Chat" onClick={openChat}>
                <img
                  src={statusSrc}
                  alt="부스 담장자 상태 이미지"
                  style={classes.status}
                />{" "}
              </button>
            ) : null} */}

            <button
              type="button"
              style={classes.exit}
              onClick={getBackToExhibition}
            >
              <ArrowBackIcon
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {name === "intro" && (
        <IntroVideo
          user={user}
          onClose={() => setModalName("")}
          boothInfo={boothInfo}
        />
      )}
      {name === "overview" && (
        <Overview onClose={() => setModalName("")} boothInfo={boothInfo} />
      )}
      {name === "brochure" && (
        <Brochure
          user={user}
          onClose={() => setModalName("")}
          boothInfo={boothInfo}
        />
      )}

      {openMeeting && (
        <VideoChat
          user={user}
          setBoothInfo={setBoothInfo}
          boothInfo={boothInfo}
          setOpenMeeting={setOpenMeeting}
        />
      )}
      {openBoothChatRequestForm && (
        <BoothChatRequestForm
          boothInfo={boothInfo}
          setOpenBoothChatRequestForm={setOpenBoothChatRequestForm}
        />
      )}
    </>
  );
};

export default Booth;
