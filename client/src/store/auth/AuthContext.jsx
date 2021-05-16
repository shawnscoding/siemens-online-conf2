import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getParameterByName, isEmpty } from "../../utils/helper";
import { apiClient } from "../../utils/data/api";
import GoVentIoPush from "../../utils/GoVentIoPush";
import ChannelService from "../../utils/ChannelService";

const AuthContext = React.createContext(null);
const initialUser = {
  access_type: "",
  affiliation: "",
  email: "",
  idx: 0,
  company_idx: -1,
  meeting_url: null,
  is_agreed_privacy_policy: "N",
  is_agreed_network_policy: "N",
  is_paid_user: "",
  name: "",
  role: "",
};

const getReferencedBy = () => {
  const referece = getParameterByName("reference");
  if (!referece) return "";
  return referece;
};

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();
  const [user, setUser] = useState(initialUser);
  const [referencedBy, setReferencedBy] = React.useState(getReferencedBy());

  const changeToUnauthState = () => {
    setIsAuthenticated(false);
    setLoading(false);
  };

  const shutdownThirdParty = () => {
    if (window.GoVentIoPush) { // init 하기 전 logout 시킴.
      GoVentIoPush.destroy();
    }
    ChannelService.shutdown();
  };

  const logout = useCallback(() => {
    shutdownThirdParty();

    localStorage.removeItem("staySignedIn");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(initialUser);
    history.push("/");
  }, []);

  const onLogin = ({ newToken, loggedUser }) => {
    if (isEmpty(newToken)) throw Error("no newToken");
    localStorage.setItem("token", newToken);
    setIsAuthenticated(true);
    setUser(loggedUser);
  };

  useEffect(() => {
    if (
      !isEmpty(localStorage.getItem("token")) &&
      localStorage.getItem("staySignedIn")
    ) {
      const loadUser = async () => {
        try {
          const res = await apiClient.get("/me");
          setUser(res.data);
          setIsAuthenticated(true);
          setLoading(false);
        } catch (err) {
          setUser(initialUser);
          setIsAuthenticated(false);
          setLoading(false);
        }
      };
      loadUser();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const store = {
    isAuthenticated,
    loading,
    user,
    onLogin,
    logout,
    setUser,
    changeToUnauthState,
    referencedBy,
    setReferencedBy,
  };

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
