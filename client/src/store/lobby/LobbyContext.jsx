import React from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../auth/AuthContext";
import { apiClient } from "../../utils/data/api";
import { isOpentime } from "../../utils/helper";
import ChannelService from "../../utils/ChannelService";
import { useLocation } from "react-router";

const LobbyContext = React.createContext(null);

export const LOGIN_MODAL_FOFR_NAMES = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  FIND_PASSWORD: "FIND_PASSWORD",
};

const modalManagerInitialState = {
  subConference: {
    open: false,
  },
  liveRoom: {
    open: false,
  },
  helpDesk: {
    open: false,
  },
  programInfo: {
    open: false,
  },
  myProfile: {
    open: false,
  },
  vodRoom: {
    open: false,
  },
  alert: {
    open: false,
    msg: "",
    header: "Alert",
    btns: [],
  },
  login: {
    open: false,
    name: LOGIN_MODAL_FOFR_NAMES.LOGIN,
  },
  notificationAlert: [],
  introVideo: {
    open: false,
  },
  lobbyVideo2: {
    open: false,
  },
  sponsor: {
    open: false,
  },
  agencyList: {
    open: false,
  },
  lounge: {
    open: false,
  },
  exhibition: {
    open: false,
  },
  exhibitorList: {
    open: false,
  },
  stamp: {
    open: false,
  },
  survey: {
    open: false,
  },
  chat: {
    open: false,
    option: {
      from: {},
      message: "",
      nick: "",
    },
  },
  chatWaiting: {
    open: false,
  },
  event: {
    open: false,
  },
};

const LobbyProvider = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  const [modalManager, setModalManager] = React.useState(
    modalManagerInitialState
  );

  const [lobbyDatas, setLobbyDatas] = React.useState({});

  React.useEffect(() => {
    const fetchLobbyData = async () => {
      try {
        const res = await apiClient.get("/lobby");

        const _lobbyDatas = {};
        for (const item of res.data) {
          _lobbyDatas[item.subject] = item;
        }

        setLobbyDatas(_lobbyDatas);
      } catch (err) {
        console.log("fetchLobbyData err ::", err);
      }
    };
    fetchLobbyData();
  }, []);

  const handleAlertClose = () => {
    setModalManager((prev) => ({
      ...prev,
      alert: {
        open: false,
        header: "Alert",
        msg: "",
      },
    }));
  };

  const handleNotificationAlertClose = (id) => {
    setModalManager((prev) => ({
      ...prev,
      notificationAlert: prev.notificationAlert.filter((v) => v.id !== id),
    }));
  };

  const closeAllModalsExceptAlert = () => {
    const alert = { ...modalManager.alert };
    modalManagerInitialState.alert = alert;
    setModalManager(modalManagerInitialState);
  };

  const openAlertOnTokenError = () => {
    setModalManager((prev) => ({
      ...prev,
      alert: {
        ...prev.alert,
        msg: "Your token has been expired. \n Please log in again ",
        open: true,
      },
    }));
  };

  const openNotAuthenticatedAlert = () => {
    const onClickLogin = () => {
      // close alert and program and open login form modal
      setModalManager((prev) => ({
        ...modalManagerInitialState,
        alert: {
          ...prev.alert,
          open: false,
          btns: [],
        },
        login: {
          ...prev.login,
          open: true,
          name: LOGIN_MODAL_FOFR_NAMES.LOGIN,
        },
      }));
    };

    const onClickRegister = () => {
      // close alert and program and open register form modal
      setModalManager((prev) => ({
        ...modalManagerInitialState,
        alert: {
          ...prev.alert,
          open: false,
          btns: [],
        },
        login: {
          ...prev.login,
          open: true,
          name: LOGIN_MODAL_FOFR_NAMES.REGISTER,
        },
      }));
    };

    setModalManager((prev) => ({
      ...prev,
      alert: {
        ...prev.alert,
        open: true,
        msg: `로그인해 주세요`,
        btns: [
          {
            label: "로그인",
            onClick: onClickLogin,
          },
          {
            label: "행사등록",
            onClick: onClickRegister,
          },
        ],
      },
    }));
  };

  const openHelpDesk = () => {
    if (!lobbyDatas.helpData) return;

    const open = isOpentime(lobbyDatas.helpData);
    if (!open) {
      setModalManager((prev) => ({
        ...prev,
        alert: {
          ...prev.alert,
          open: true,
          msg: `지금은 헬프데스크 운영 시간이 아닙니다.
            (운영 시간 09:30 ~ 16:00)
            문의사항이 있으실 경우
            siemens_info@fineplays.co.kr으로
            연락 주시기 바랍니다.`,
        },
      }));
      return;
    }

    // ChannelService.boot({
    //   pluginKey: "3f4d23da-61bd-4eba-9503-32b5cef16b46", //please fill with your plugin key
    // });
    // console.log("user ::", user);
    ChannelService.boot({
      pluginKey: "3f4d23da-61bd-4eba-9503-32b5cef16b46", //please fill with your plugin key
      profile: {
        name: user.name, // agent 화면에서 조회 / 수정할 수 있음. 유료.
        mobileNumber: user.mobile_no, //fill with user phone number
        CUSTOM_VALUE_1: user.email, //any other custom meta data
        CUSTOM_VALUE_2: user.title,
      },
    });
  };

  const location = useLocation();
  // console.log("location ", location);
  const pathname = location.pathname.split("/")[1];

  const openSurvey = () => {
    if (!lobbyDatas.survey) return;

    if (pathname !== "rehearsal") {
      const open = isOpentime(lobbyDatas.survey);
      if (!open) {
        setModalManager((prev) => ({
          ...prev,
          alert: {
            ...prev.alert,
            open: true,
            msg: `4/7 ~ 4/8 본 행사 동안 진행되는 설문지 입니다.
          행사 당일 많은 참여 부탁드립니다.`,
          },
        }));
        return;
      }
    }
    setModalManager((prev) => ({
      ...prev,
      survey: {
        open: true,
      },
    }));
  };

  const openStampTour = () => {
    // console.log("lobbyDatas.stampOpenTime ::", lobbyDatas.stampOpenTime);
    if (!lobbyDatas.stampOpenTime) return;
    const open = isOpentime(lobbyDatas.stampOpenTime);

    if (pathname !== "rehearsal") {
      if (!open) {
        setModalManager((prev) => ({
          ...prev,
          alert: {
            ...prev.alert,
            open: true,
            msg: `4/7 ~ 4/8 본 행사 동안 진행되는 이벤트 입니다. 
          행사 당일 많은 참여 부탁드립니다.`,
          },
        }));
        return;
      }
    }

    setModalManager((prev) => ({
      ...prev,
      stamp: {
        open: true,
      },
    }));
  };

  const openLiveRoom = () => {
    if (!lobbyDatas.liveRoomOpenTime) return;

    if (pathname !== "rehearsal" && pathname !== "liveRoom") {
      const open = isOpentime(lobbyDatas.liveRoomOpenTime);
      if (!open) {
        setModalManager((prev) => ({
          ...prev,
          alert: {
            ...prev.alert,
            open: true,
            msg: lobbyDatas.liveRoomOpenTime.msg,
          },
        }));
        return;
      }
    }
    setModalManager((prev) => ({
      ...prev,
      liveRoom: {
        open: true,
      },
    }));
  };

  const openVodRoom = () => {
    // if (pathname !== "salin" && pathname !== "vodRoom") {
    //   setModalManager((prev) => ({
    //     ...prev,
    //     alert: {
    //       ...prev.alert,
    //       open: true,
    //       msg: `4월 12일부터 16일까지 온디맨드 컨퍼런스로
    //       다시 찾아 뵙겠습니다.`,
    //     },
    //   }));
    // } else {
    // setModalManager((prev) => ({
    //   ...prev,
    //   vodRoom: {
    //     open: true,
    //   },
    // }));
    // }

    const open = isOpentime(lobbyDatas.liveRoomOpenTime);
    if (open) {
      setModalManager((prev) => ({
        ...prev,
        vodRoom: {
          open: true,
        },
      }));
    } else {
      setModalManager((prev) => ({
        ...prev,
        alert: {
          ...prev.alert,
          open: true,
          msg: lobbyDatas.liveRoomOpenTime.msg,
        },
      }));
      return;
    }
  };

  React.useEffect(() => {
    // console.log("location.pathname ", location.pathname);
    if (lobbyDatas.survey && location.pathname === "/rehearsal") {
      setModalManager((prev) => ({
        ...prev,
        liveRoom: {
          open: true,
        },
      }));
    }
  }, [location, lobbyDatas]);

  const openProgramInfo = () => {
    setModalManager((prev) => ({
      ...prev,
      programInfo: {
        open: true,
      },
    }));
  };

  // const [chatClient] = useChat();

  const store = {
    modalManager,
    setModalManager,
    lobbyDatas,
    setLobbyDatas,
    openLiveRoom,
    handleAlertClose,
    openAlertOnTokenError,
    closeAllModalsExceptAlert,
    handleNotificationAlertClose,
    openNotAuthenticatedAlert,
    openHelpDesk,
    openStampTour,
    openSurvey,
    openVodRoom,
    openProgramInfo,
  };

  return (
    <LobbyContext.Provider value={store}>{children}</LobbyContext.Provider>
  );
};

LobbyProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { LobbyProvider, LobbyContext };
