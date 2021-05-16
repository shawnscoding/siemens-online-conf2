import React, { useState, useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import { AuthContext } from "../../store/auth/AuthContext";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import define from "../../config/define";

const Container = styled.header`
  left: ${(props) =>
    props.open === "open" ? "0px !important" : "-261px !important"};
  transition: left 0.3s;
`;

const Navbar = () => {
  // const user = useContext(AppContext);
  const { logout, user } = useContext(AuthContext);
  const {
    setModalManager,
    openSurvey,
    openHelpDesk,
    openStampTour,
    openLiveRoom,
    openVodRoom,

    openProgramInfo,
  } = useContext(LobbyContext);
  const history = useHistory();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const handleToggleNavbar = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    // this is for closing navbar when user log out
    return () => {
      setOpen(false);
    };
  }, [location]);

  const handleRouting = (path) => {
    history.push(path);
  };

  const openModal = (name) => {
    if (name === "subConference") {
      setModalManager((prev) => ({
        ...prev,
        alert: {
          ...prev.alert,
          open: true,
          msg: `4월 12일부터 16일까지 온디맨드 컨퍼런스로 
          다시 찾아 뵙겠습니다.`,
        },
      }));
      return;
    }

    const newState = { open: true };
    setModalManager((prev) => ({
      ...prev,
      [name]: newState,
    }));
  };

  const clickProfile = () => {
    setModalManager((prev) => ({
      ...prev,
      myProfile: {
        open: true,
      },
    }));
  };

  const {
    ICON_HOME,
    ICON_HELP,
    ICON_AUDITORIUM,
    ICON_SESSION,
    ICON_PROGRAMME,
    ICON_NETWORKLOUNGE,
    ICON_STAMP,
    ICON_SURVEY,
    POWERED_BY,
  } = define.RESOURCE;

  return (
    <Container
      open={open ? "open" : "close"}
      className={`header ${open ? "on" : ""}`}
    >
      {open ? (
        // <StyledCloseIcon onClick={handleToggleNavbar} />
        <button onClick={handleToggleNavbar} className="hamburger">
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
          <span className="hamburger__line"></span>
        </button>
      ) : (
        <button className="hamburger" onClick={handleToggleNavbar}>
          <div className="hamburger__line" />
          <div className="hamburger__line" />
          <div className="hamburger__line" />
        </button>
      )}

      <div className="header__sidebar">
        <div className="header__logobox">
          <h1 className="header__logo logo">
            2020 Autumn Conference for Talent Management
          </h1>
        </div>
        <div className="profile">
          <div className="profile__username strong">{user && user.name}</div>
          <div className="profile__menu">
            <button
              type="button"
              className="profile__item"
              onClick={clickProfile}
            >
              My Page
            </button>
            &nbsp;&nbsp;/&nbsp;&nbsp;
            <button type="button" className="profile__item" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
        <nav className="nav">
          <ul className="nav__wrap">
            <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={() => handleRouting("/lobby")}
              >
                <img className="nav__icon" src={ICON_HOME} alt="" />
                Lobby
              </button>
            </li>
            <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={openProgramInfo}
              >
                <img className="nav__icon" src={ICON_PROGRAMME} alt="" />
                Program
              </button>
            </li>
            {/* <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={openLiveRoom}
              >
                <img className="nav__icon" src={ICON_AUDITORIUM} alt="" />
                Live Conference Hall
              </button>
            </li> */}
            <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={() =>
                  setModalManager((prev) => ({
                    ...prev,
                    exhibition: {
                      open: true,
                    },
                  }))
                }
              >
                <img
                  className="nav__icon"
                  src={`${define.CDN_HOST}/assets/menu_icon/icon_exhibition.png`}
                  alt=""
                />
                EXHIBITION Booth
              </button>
            </li>
            <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={openProgramInfo}
              >
                <img className="nav__icon" src={ICON_SESSION} alt="" />
                VOD Room
              </button>
            </li>
            {/* <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={() =>
                  setModalManager((prev) => ({
                    ...prev,
                    lounge: {
                      open: true,
                    },
                  }))
                }
              >
                <img className="nav__icon" src={ICON_NETWORKLOUNGE} alt="" />
                Networking Lounge
              </button>
            </li> */}
            {/* <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={openStampTour}
              >
                <img className="nav__icon" src={ICON_STAMP} alt="" />
                Stamp Tour
              </button>
            </li> */}
            {/* <li className="nav__item">
              <button type="button" className="nav__link" onClick={openSurvey}>
                <img className="nav__icon" src={ICON_SURVEY} alt="" />
                Survey
              </button>
            </li> */}
            <li className="nav__item">
              <button
                type="button"
                className="nav__link"
                onClick={() => openHelpDesk()}
              >
                <img className="nav__icon" src={ICON_HELP} alt="" />
                Help Desk
              </button>
            </li>
            <li
              className="powered_by_wrapper"
              style={{
                position: "absolute",
                width: "100%",
                height: "67px",
                bottom: 0,
              }}
            >
              <span className="powered_by" />
            </li>
          </ul>
        </nav>
        <p className="nav__copyright">
          Provided by &nbsp;
          <a
            href="https://www.salin.co.kr/"
            target="_blank"
            className="nav__copyright--link"
          >
            Salin
          </a>
          {/* <span className="nav__copyright--under">
            <a
              href="https://www.fineplays.co.kr/"
              target="_blank"
              className="nav__copyright--link"
            >
              Fineplays
            </a>{" "}
            &{" "}
            <a
              href="https://www.salin.co.kr/"
              target="_blank"
              className="nav__copyright--link"
            >
              Salin
            </a>
          </span> */}
        </p>
      </div>
    </Container>
  );
};

const NavbarContainer = () => {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) return <></>;
  return <Navbar />;
};

export default NavbarContainer;
