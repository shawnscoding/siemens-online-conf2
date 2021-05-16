import React from "react";
import ReactPlayer from "react-player/lazy";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import define from "../../config/define";
import useResize from "../../hooks/useResize";
import { AuthContext } from "../../store/auth/AuthContext";
import {
  LobbyContext,
  LOGIN_MODAL_FOFR_NAMES,
} from "../../store/lobby/LobbyContext";
import { getParameterByName } from "../../utils/helper";
import LoginModal from "../common/login-register/LoginModal";
import IntroVideo from "../lobby/modal/IntroVideo";
import WelcomeMsgModal from "./modal/WelcomeMsgModal";

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

const ToLiveRoomBtn = styled.button`
  width: 463px;
  height: 111px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 543px;
  display: block;
  cursor: default;
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
  cursor: default;
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
  cursor: default;
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
  cursor: default;
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
  cursor: default;
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
  cursor: default;
  left: 51px;
  z-index: 2;
  color: transparent;
`;

const BtnBox = styled.div`
  position: fixed;
  left: 0;
  bottom: 50px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 1000;
`;

const EventPopper = styled.button`
  width: 255px;
  height: 116px;
  font-size: 25px;
  /* background-color: rgba(255, 0, 0, 0.5); */
  position: absolute;
  top: 50px;
  display: block;
  left: 1226px;
  z-index: 2;
  color: transparent;
`;

const getInitialState = () => {
  const isOpen = JSON.parse(localStorage.getItem("welcomeMsgOpen"));
  // console.log("isOpen ::", isOpen);
  if (isOpen === null) return true;
  if (isOpen === false) return false;
  else return true;
};

const Intro = () => {
  const videoRef = React.useRef();
  const contentWrapRef = React.useRef(null);
  const { isAuthenticated, loading, referencedBy } = React.useContext(
    AuthContext
  );
  const [welcomeMsgModal, setWelcomeMsgModal] = React.useState({
    open: false,
  });
  const { contentWrapStyle, contentResizeStyle } = useResize(contentWrapRef);

  const [currentTime, setCurrentTime] = React.useState(null);

  const {
    modalManager: { introVideo, login },
    lobbyDatas: { lobbyVod },
    setModalManager,
    openProgramInfo,
    openNotAuthenticatedAlert,
  } = React.useContext(LobbyContext);

  React.useEffect(() => {
    if (referencedBy) {
      setModalManager((prev) => ({
        ...prev,
        login: {
          ...prev.login,
          open: true,
          name: LOGIN_MODAL_FOFR_NAMES.REGISTER,
        },
      }));
    } else if (getInitialState()) setWelcomeMsgModal({ open: true });
    // }
  }, []);

  const closeLoginModal = () => {
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: false,
        name: LOGIN_MODAL_FOFR_NAMES.LOGIN,
      },
    }));
  };

  const openLoginModal = () => {
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: true,
        name: LOGIN_MODAL_FOFR_NAMES.LOGIN,
      },
    }));
  };

  const toggleWelcomeMsgModal = (ref) => {
    localStorage.setItem("welcomeMsgOpen", !ref.current.checked);
    setWelcomeMsgModal((prev) => ({ open: !prev.open }));
  };

  const handleLoginBtnClick = (ref) => {
    localStorage.setItem("welcomeMsgOpen", !ref.current.checked);

    setWelcomeMsgModal({ open: false });
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: true,
        name: LOGIN_MODAL_FOFR_NAMES.LOGIN,
      },
    }));
  };

  const openIntroVideo = () => {
    setCurrentTime(videoRef.current.getCurrentTime());

    setModalManager((prev) => ({
      ...prev,
      introVideo: {
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

  const openExhibitorList = () => {
    setModalManager((prev) => ({
      ...prev,
      exhibitorList: {
        open: true,
      },
    }));
  };

  const openRegister = () => {
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: true,
        name: LOGIN_MODAL_FOFR_NAMES.REGISTER,
      },
    }));
  };

  if (!loading && isAuthenticated) return <Redirect to="/lobby" />;

  return (
    <>
      {/* {!login.open && !welcomeMsgModal.open && (
        <BtnBox>
          <button
            style={{
              width: "260px",
            }}
            onClick={openLoginModal}
            type="button"
            className="popbtn__button"
          >
            로그인
          </button>
        </BtnBox>
      )} */}
      {/* <div
        style={{
          height: "100%",
          background:
            "linear-gradient(rgb(4, 16, 21) 0%, rgb(12, 41, 54) 100%)",
        }}
      > */}
      <div className="lobby-wrap">
        <button
          onClick={openLoginModal}
          type="button"
          className="popbtn__button lobby-btn__button"
        >
          로그인
        </button>
        <button
          onClick={openRegister}
          type="button"
          className="popbtn__button lobby-btn__button lobby-btn__button--gray"
        >
          행사등록
        </button>
      </div>
      {/* </div> */}
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
            <EventPopper
              title="Open event modal"
              type="button"
              onClick={openEventModal}
            ></EventPopper>
            <ToLiveRoomBtn
              title="live room"
              type="button"
              onClick={openNotAuthenticatedAlert}
            >
              live room
            </ToLiveRoomBtn>
            <ToVODroomBtn
              title="vod room"
              type="button"
              onClick={openNotAuthenticatedAlert}
            >
              vod room
            </ToVODroomBtn>
            <ExhibitionHallOpener
              type="button"
              title="exhibition hall"
              onClick={openNotAuthenticatedAlert}
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
              onClick={openNotAuthenticatedAlert}
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
            <NetworkLoungeOpener
              type="button"
              title="open Network lounge"
              onClick={openNotAuthenticatedAlert}
            />
            <SurveyOpener
              title="open survey"
              type="button"
              onClick={openNotAuthenticatedAlert}
            />
            <StampOpener
              type="button"
              title="open stamp"
              onClick={openNotAuthenticatedAlert}
            />
          </div>
        </div>
      </div>

      {login.open && <LoginModal onClose={closeLoginModal} />}
      {/* {welcomeMsgModal.open && (
        <WelcomeMsgModal
          onClick={handleLoginBtnClick}
          onClose={toggleWelcomeMsgModal}
        />
      )} */}
      {introVideo.open && <IntroVideo currentTime={currentTime} />}
    </>
  );
};

export default Intro;
