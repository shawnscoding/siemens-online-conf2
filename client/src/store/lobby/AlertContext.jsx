import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { apiClient } from "../../utils/data/api";
import { AuthContext } from "../auth/AuthContext";
import { checkCurrentTime } from "../../utils/timer";
import { LobbyContext } from "./LobbyContext";

const ConferenceAlertContext = createContext();

const ConferenceAlertProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationIndex, setNotificationIndex] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);
  const { setModalManager } = useContext(LobbyContext);
  let intervalId = 0;
  let isIntervalWokring = false;

  const changeState = (indexes) => {
    setNotificationIndex(indexes);
    setModalManager((prev) => ({
      ...prev,
      notificationAlert:
        indexes.map((id) => {
          return { id };
        }) || [],
    }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      const getNotifications = async () => {
        try {
          const { data } = await apiClient.get("/notification");
          setNotifications(data);
          intervalId = setInterval(() => {
            const result = checkCurrentTime(data);
            changeState(result);
          }, 60000);

          const indexes = checkCurrentTime(data);
          if (indexes.length && !isIntervalWokring) {
            isIntervalWokring = true;
            changeState(indexes);
          }
        } catch (error) {
          console.error("getNoticiation error :", error);
        }
      };

      getNotifications();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated]);

  const value = {
    notifications,
    notificationIndex,
  };
  return (
    <ConferenceAlertContext.Provider value={value}>
      {children}
    </ConferenceAlertContext.Provider>
  );
};

ConferenceAlertProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { ConferenceAlertContext, ConferenceAlertProvider };
