import React, { useContext, useEffect, useState, useRef } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { AuthContext } from "../store/auth/AuthContext";
import Navbar from "./common/Navbar";
import Intro from "./intro/Intro";
import LobbyPage from "./lobby/LobbyPage";
import Booth from "./exhibition/booth/Booth";
import { LobbyContext } from "../store/lobby/LobbyContext";
import SubConferenceList from "./lobby/modal/SubConferenceList";
import LiveRoomListModal from "./lobby/liveRoomModal/LiveRoomListModal";

import ProfilePage from "./profile/ProfilePage";
import ProgramInfo from "./lobby/programModal/ProgramInfo";
import HelpDesk from "./lobby/modal/HelpDesk";
import { networkService } from "../utils/data/api";
import AlertModal from "./common/AlertModal";
import ExhibitionHall from "./exhibition/ExhibitionHall";
import ExhibitionIntroModal from "./lobby/modal/ExhibitionIntroModal";

import NetworkLounge from "./lobby/modal/NetworkLounge";
import StampTour from "./lobby/modal/StampTour";
import Survey from "./lobby/modal/Survey";
import ExhibitiorList from "./lobby/exhibitorList/ExhibitiorList";
import LiveRoom from "./liveRoom/LiveRoom";
import EventModal from "./lobby/modal/EventModal";
// import Crontab from "./crontab/Crontab";
import VodRoomListModal from "./lobby/vodRoomModal/VodRoomListModal";
import VodRoom from "./vodRoom/VodRoom";
import { isOpentime } from "../utils/helper";

const App = () => {
  const {
    openAlertOnTokenError,
    closeAllModalsExceptAlert,
    modalManager,
    setModalManager,
    lobbyDatas: { alertOnEnter },
  } = useContext(LobbyContext);
  const {
    exhibition,
    lounge,
    myProfile,
    programInfo,
    helpDesk,
    stamp,
    survey,
    exhibitorList,
    vodRoom,
    alert,
    event,
    subConference,
    liveRoom,
  } = modalManager;
  const { changeToUnauthState, isAuthenticated } = useContext(AuthContext);
  const handleDirectToIntroPage = () => {
    openAlertOnTokenError();
    closeAllModalsExceptAlert();
    changeToUnauthState();
  };

  networkService.setupInterceptors(handleDirectToIntroPage);

  // + chat
  // const [openChat, setOpenChat] = useState(false);
  // const [roomId, setRoomId] = useState("");
  // const [nick, setNick] = useState("");
  const [chatEvent, setChatEvent] = useState({});
  // const roomIdRef = useRef("");
  // const [goventPushToken, setGoventPushToken] = useState("");
  // - chat

  // console.log("[ App ] rendered");

  React.useEffect(() => {
    console.log("alertOnEnter ::", alertOnEnter);
    if (alertOnEnter && alertOnEnter.open_datetime) {
      const isTrue = isOpentime({
        open_datetime: alertOnEnter.open_datetime,
        close_datetime: alertOnEnter.close_datetime,
      });
      if (isTrue) {
        setModalManager((prev) => ({
          ...prev,
          alert: {
            ...prev.alert,
            open: true,
            msg: alertOnEnter.msg,
          },
        }));
      }
    }
  }, [alertOnEnter]);

  return (
    <div
      style={{
        height: "100%",
        background: "linear-gradient(to bottom, #041015 0%, #0c2936 100%)",
      }}
    >
      {helpDesk.open && <HelpDesk />}

      {subConference.open && <SubConferenceList />}
      {liveRoom.open && <LiveRoomListModal />}
      {vodRoom.open && <VodRoomListModal />}
      {programInfo.open && <ProgramInfo />}
      {myProfile.open && <ProfilePage />}
      {exhibition.open && <ExhibitionIntroModal />}
      {exhibitorList.open && <ExhibitiorList />}
      {lounge.open && <NetworkLounge chatEvent={chatEvent} />}
      {stamp.open && <StampTour />}
      {survey.open && <Survey />}
      {alert.open && <AlertModal />}
      {event.open && <EventModal />}
      {/* {isAuthenticated && <Crontab />} */}
      {/* {chat.open && roomId === "" && (
        <ChatConfirmModal
          setRoomId={(i) => setRoomId(i)}
          setNick={(n) => setNick(n)}
          setOpenChat={() => setOpenChat(true)}
        />
      )} */}
      <Navbar />
      {/* {openChat && (
        <ChatRoom
          openChat={openChat}
          setOpenChat={setOpenChat}
          setChatEvent={setChatEvent}
          roomId={roomId}
          setRoomId={(i) => setRoomId(i)}
          nick={nick}
        />
      )} */}
      <Switch>
        <Route exact path="/">
          <Intro />
        </Route>
        <Route exact path="/rehearsal">
          <LobbyPage />
        </Route>
        <Route exact path="/salin">
          <LobbyPage />
        </Route>

        <Route exact path="/lobby">
          <LobbyPage />
        </Route>

        <Route exact path="/liveRoom/:session_code">
          <LiveRoom />
        </Route>
        <Route exact path="/vodRoom/:session_code">
          <VodRoom />
        </Route>

        <Route exact path="/exhibition/:id" component={ExhibitionHall} />
        <Route exact path="/booth/:id" component={Booth} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;
