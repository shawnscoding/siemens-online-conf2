import React, { useContext, useRef } from "react";
import { Redirect } from "react-router-dom";
import ReactPlayer from "react-player/lazy";
import define from "../../config/define";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import IntroVideo from "./modal/IntroVideo";
import { AuthContext } from "../../store/auth/AuthContext";
import styled from "styled-components";
import useResize from "../../hooks/useResize";
import LobbyVideo2 from "./modal/LobbyVideo2";

const IntroVideoBox = styled.div`
  position: absolute;
  left: 730px;
  top: 273px;
  width: 459px;
  height: 257px;
  display: block;
  cursor: pointer;
  z-index: 2;
`;

const LobbyVideo2Box = styled.button`
  width: 486px;
  height: 227px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 796px;
  display: block;
  cursor: pointer;
  left: 1310px;
  z-index: 2;
  color: transparent;
`;

const ToLiveRoomBtn = styled.button`
  width: 463px;
  height: 111px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 543px;
  display: block;
  cursor: pointer;
  left: 725px;
  z-index: 2;
  color: transparent;
`;

const ToVODroomBtn = styled.button`
  width: 255px;
  height: 157px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 407px;
  display: block;
  cursor: pointer;
  left: 1284px;
  z-index: 2;
  color: transparent;
`;

const ExhibitionHallOpener = styled.button`
  width: 228px;
  height: 144px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 404px;
  display: block;
  cursor: pointer;
  left: 376px;
  z-index: 2;
  color: transparent;
`;

const ExhibitorListOpener = styled.button`
  width: 100px;
  height: 121px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 428px;
  display: block;
  cursor: pointer;
  left: 614px;
  z-index: 2;
  color: transparent;
`;

const HelpDeskOpener = styled.button`
  position: absolute;
  left: 967px;
  top: 712px;
  width: 45px;
  height: 53px;
`;

const ProgramOpener = styled.button`
  width: 255px;
  height: 116px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 50px;
  display: block;
  cursor: pointer;
  left: 439px;
  z-index: 2;
  color: transparent;
`;

const SurveyOpener = styled.button`
  width: 100px;
  height: 192px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 652px;
  display: block;
  cursor: pointer;
  left: 620px;
  z-index: 2;
  color: transparent;
`;

const StampOpener = styled.button`
  width: 99px;
  height: 195px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 654px;
  display: block;
  cursor: pointer;
  left: 1197px;
  z-index: 2;
  color: transparent;
`;

const NetworkLoungeOpener = styled.button`
  width: 555px;
  height: 273px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 759px;
  display: block;
  cursor: pointer;
  left: 51px;
  z-index: 2;
  color: transparent;
`;

const EventPopper = styled.button`
  width: 255px;
  height: 116px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 50px;
  display: block;
  cursor: pointer;
  left: 1226px;
  z-index: 2;
  color: transparent;
`;

const LobbyPage = () => {
  const contentWrapRef = useRef(null);
  const {
    setModalManager,
    modalManager: { introVideo, lobbyVideo2 },
    lobbyDatas: { lobbyVod },
    openHelpDesk,
    openStampTour,
    openSurvey,
    openProgramInfo,
    openLiveRoom,
    openVodRoom,
  } = useContext(LobbyContext);
  const { contentWrapStyle, contentResizeStyle } = useResize(contentWrapRef);

  const videoRef = React.createRef();

  React.useEffect(() => {
    const introMsgOfHelpDeskOpen = localStorage.getItem(
      "introMsgOfHelpDeskOpen"
    );
    if (introMsgOfHelpDeskOpen === null) {
      setModalManager((prev) => ({
        ...prev,
        alert: {
          ...prev.alert,
          open: true,
          msg: `컨퍼런스 장에 오신 것을 환영합니다!
          자유롭게 둘러 보시고 홈페이지 이용 관련 
          궁금하신 사항은 Help Desk 클릭 후 
          우측 하단의 말풍선을 눌러 문의해 주세요.`,
        },
      }));

      localStorage.setItem("introMsgOfHelpDeskOpen", false);
    }
  }, []);

  const openExhibitionHall = () => {
    setModalManager((prev) => ({
      ...prev,
      exhibition: {
        open: true,
      },
    }));
  };

  const openExhibitorList = () => {
    setModalManager((prev) => ({
      ...prev,
      exhibitorList: {
        open: true,
      },
    }));
  };

  const openIntroVideo = () => {
    setModalManager((prev) => ({
      ...prev,
      introVideo: {
        open: true,
      },
    }));
  };

  const openNetworkLounge = () => {
    setModalManager((prev) => ({
      ...prev,
      lounge: {
        open: true,
      },
    }));
  };

  const openEventModal = () => {
    setModalManager((prev) => ({
      ...prev,
      event: {
        open: true,
      },
    }));
  };

  const openLobbyVideo2 = () => {
    setModalManager((prev) => ({
      ...prev,
      lobbyVideo2: {
        open: true,
      },
    }));
  };

  return (
    <>
      <div
        className="lobby wrapper login-wrap"
        style={{ position: "relative" }}
      >
        <div className="content-wrap" style={contentWrapStyle}>
          <div
            className="canvas-wrap"
            ref={contentWrapRef}
            style={contentResizeStyle}
          >
            <img
              alt="로비 배경 화면"
              src={define.RESOURCE.LOBBY_BACKGROUND}
              className="lobby__background"
            />
            {/* <EventPopper
              title="Open event modal"
              type="button"
              onClick={openEventModal}
            ></EventPopper> */}
            {/* <ToLiveRoomBtn
              title="live room"
              type="button"
              onClick={openLiveRoom}
            >
              live room
            </ToLiveRoomBtn> */}
            <ToVODroomBtn
              title="vod room"
              type="button"
              onClick={openProgramInfo}
            >
              vod room
            </ToVODroomBtn>
            <ExhibitionHallOpener
              type="button"
              title="exhibition hall"
              onClick={openExhibitionHall}
            >
              exhibition hall
              {/* 전체 회의장 - 기능완료 */}
            </ExhibitionHallOpener>
            {/* 우측 상단 축하영상 */}
            {lobbyVod && (
              <IntroVideoBox>
                <ReactPlayer
                  ref={videoRef}
                  url={lobbyVod.action_url}
                  playing
                  loop
                  width="100%"
                  height="100%"
                  volume={0}
                />
                <div
                  style={{
                    position: "relative",
                    top: "-226px",
                    height: "226px",
                    zIndex: "2",
                  }}
                  onClick={openIntroVideo}
                />
              </IntroVideoBox>
            )}
            <HelpDeskOpener
              type="button"
              title="open help desk"
              onClick={openHelpDesk}
            >
              <img
                src={define.RESOURCE.ICON_QUESTION}
                alt="헬프데스크 아이콘"
                style={{
                  position: "absolute",
                  left: "0",
                  top: "0",
                  width: "100%",
                  height: "100%",
                }}
              />
            </HelpDeskOpener>
            <ProgramOpener
              type="button"
              title="open program table"
              onClick={openProgramInfo}
            />
            <ExhibitorListOpener
              type="button"
              title="open exhibitor list"
              className="opener__sponsor"
              onClick={openExhibitorList}
            ></ExhibitorListOpener>
            {/* <NetworkLoungeOpener
              type="button"
              title="open Network lounge"
              onClick={openNetworkLounge}
            /> */}
            {/* <SurveyOpener
              title="open survey"
              type="button"
              onClick={openSurvey}
            /> */}
            {/* <StampOpener
              type="button"
              title="open stamp"
              onClick={openStampTour}
            /> */}
            <LobbyVideo2Box
              type="button"
              title="Lobby Video2"
              onClick={openLobbyVideo2}
            />
          </div>
        </div>
      </div>
      {introVideo.open && <IntroVideo />}
      {lobbyVideo2.open && <LobbyVideo2 />}
    </>
  );
};

const LobbyPageRouter = () => {
  const { isAuthenticated, loading } = React.useContext(AuthContext);
  if (!loading && !isAuthenticated) return <Redirect to="/" />;
  return <LobbyPage />;
};

export default LobbyPageRouter;
