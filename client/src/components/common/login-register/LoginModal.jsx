import React, { useState } from "react";
import LoginForm from "../LoginForm";
import ResetPassword from "./ResetPassword";
import Register from "./RegisterModal";
import {
  LobbyContext,
  LOGIN_MODAL_FOFR_NAMES,
} from "../../../store/lobby/LobbyContext";
// import FindUserId from "./FindUserId";

const LoginModal = ({ onClose }) => {
  // const [profileFormOpen, setProfileFormOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const {
    setModalManager,
    modalManager: { login },
  } = React.useContext(LobbyContext);

  const goToLoginForm = () => {
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: true,
        name: LOGIN_MODAL_FOFR_NAMES.LOGIN,
      },
    }));
  };
  const goToResetPassword = () => {
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: true,
        name: LOGIN_MODAL_FOFR_NAMES.FIND_PASSWORD,
      },
    }));
  };
  const goToRegister = () => {
    setModalManager((prev) => ({
      ...prev,
      login: {
        ...prev.login,
        open: true,
        name: LOGIN_MODAL_FOFR_NAMES.REGISTER,
      },
    }));
  };

  // const toggleProfileForm = (userData) => {
  //   setProfileFormOpen((prevState) => !prevState);
  //   setUser(userData);

  //   setCurrentForm((prevState) => ({
  //     ...prevState,
  //     show: !prevState.show,
  //   }));
  // };

  return (
    <>
      {login.name === LOGIN_MODAL_FOFR_NAMES.LOGIN && (
        <LoginForm
          onCloseModal={onClose}
          goToResetPassword={goToResetPassword}
          goToRegister={goToRegister}
        />
      )}
      {login.name === LOGIN_MODAL_FOFR_NAMES.FIND_PASSWORD && (
        <ResetPassword onCloseModal={onClose} onPrev={goToLoginForm} />
      )}
      {login.name === LOGIN_MODAL_FOFR_NAMES.REGISTER && (
        <Register onCloseModal={onClose} onPrev={goToLoginForm} />
      )}
    </>
  );
};

LoginModal.propTypes = {};

export default LoginModal;
