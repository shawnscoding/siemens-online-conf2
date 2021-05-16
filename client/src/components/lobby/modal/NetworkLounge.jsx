import React, { useContext, useState, useEffect } from "react";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import CommonTable from "../../common/CommonTable";
import SearchInput from "../../common/SearchInput";
import businessCard from "../../exhibition/booth/modal/BusinessCard";
import { apiClient } from "../../../utils/data/api";
import define from "../../../config/define";
import { AuthContext } from "../../../store/auth/AuthContext";
import GoVentIoPush from "../../../utils/GoVentIoPush";

const NetworkLoungeModal = (props) => {
  const { modalManager, setModalManager } = useContext(LobbyContext);
  const { lounge } = modalManager;
  // console.log("chatClient ::", chatClient);
  const { user } = useContext(AuthContext);
  const [subModalName, setSubModalName] = useState("");
  const [userList, setUserList] = useState([]);
  const [userIndex, setUserIndex] = useState("");
  const [defaultValue, setDefault] = useState(false);
  const [count, setCount] = useState({});
  const [loading, setLoading] = React.useState(false);
  // const { chatEvent } = props;
  // const timer = useRef();
  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      lounge: {
        open: false,
      },
    }));
  };
  const Components = {
    business: businessCard,
  };
  const Component = Components[subModalName];
  const triggerModal = (name) => {
    setSubModalName(name);
  };
  const handleSubModalClose = () => {
    triggerModal("");
  };
  const getUserList = async (query) => {
    if (loading) return;

    setLoading(true);
    try {
        const response = await apiClient.get(`/user?${query}`);
        const { data } = response;
        console.log("data ::", data);

        setDefault(false);
        setUserList(data);
        setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("getExhibitiorList error ::", error);
    }
  };

  // const endWaitingTimer = () => {
  //   setCount({});
  //   clearInterval(timer.current);
  // };

  // const startWaitingTimer = (idx) => {
  //   if (count[idx]) return null;
  //   setCount((prev) => {
  //     return {
  //       ...prev,
  //       [idx]: 20,
  //     };
  //   });
  //   timer.current = setInterval(() => {
  //     setCount((prev) => {
  //       const newCount = {};
  //       Object.keys(prev).forEach((v) => {
  //         if (prev[v] === 0) return clearInterval(timer);
  //         if (parseInt(v, 10) === idx) {
  //           newCount[idx] = prev[idx] - 1;
  //         } else {
  //           newCount[v] = prev[v];
  //         }
  //       });
  //       return newCount;
  //     });
  //   }, 1000);
  // };

  const inviteChat = (user) => {
    if (window.GoVentIoPush) {
      window.GoVentIoPush.openWidgetWithUser(user);
    }
  };

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    console.log("user ::", user);
    console.log("lounge.open ::", lounge.open);
    const getGoventioPushToken = async () => {
      try {
        const res = await apiClient.post("/goventio/push", {
          role: "user",
        });
        console.log("res ::", res);
        const { data } = res;
        const { clientId, userId, userName, token } = data;
        // setGoventPushToken(token);

        const options = {
          clientId,
          userId,
          userName,
          token,
          connected: async () => {
            await apiClient
              .post("/user/connected", { connected: true })
              .then((res) => {
                console.log("res ::", res);
                getUserList("");
              })
              .catch((error) => {
                console.log("error ::", error);
              });
          },
          disconnected: async (cb) => {
            // console.log("disconnected token ::", localStorage.getItem("token"));
            const token = localStorage.getItem("token");
            const config = {
              headers: { Authorization: `Bearer ${token}` },
            };
            // console.log('config ::', config);
            await apiClient
              .post("/user/connected", { connected: false }, config)
              .then((res) => {
                console.log("res ::", res);
              })
              .catch((error) => {
                console.log("error ::", error);
              });
          },
        };
        // console.log("options ::", options);
        GoVentIoPush.init(options);
        // console.log("GoVentIoPush ::", GoVentIoPush);
      } catch (error) {
        console.error("error ::", error);
      }
    };
    if (lounge.open) getGoventioPushToken();

    return () => {
      if (window.GoVentIoPush) window.GoVentIoPush.destroy();
    };
  }, [lounge.open]);

  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Networking Lounge</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content lounge">
              <div className="content-box">
                <div className="search-refresh">
                  <div style={{ position: "relative", height: "2.5rem" }}>
                    <SearchInput
                      defaultValue={defaultValue}
                      search={(keyword) => (
                        setDefault(true),
                        getUserList(
                          `affiliation=${encodeURIComponent(keyword)}`
                        )
                      )}
                      placeholder="소속 검색"
                    />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      cursor: "pointer",
                      color: "black",
                      lineHeight: "2.5rem",
                      fontSize: "1.6rem",
                    }}
                    onClick={() => (setDefault(true), getUserList(""))}
                  >
                    <span
                      style={{
                        display: "block",
                        width: "2.2rem",
                        height: "2.2rem",
                        backgroundImage: `url("${define.CDN_HOST}/assets/ico-refresh.png")`,
                        backgroundSize: "cover",
                      }}
                    />
                  </div>
                </div>
                <CommonTable
                  options={{
                    columns: [
                      {
                        key: "",
                        name: "연번",
                        formatter: () => {
                          return <td />;
                        },
                        style: {
                          width: "11%",
                        },
                      },
                      {
                        key: "name",
                        name: "이름",
                        formatter: (obj, key) => {
                          const { name } = obj;
                          return <td key={key}>{name}</td>;
                        },
                      },
                      {
                        key: "title",
                        name: "직함",
                        formatter: (obj, key) => {
                          const { title } = obj;
                          return <td key={key}>{title}</td>;
                        },
                      },
                      {
                        key: "affiliation",
                        name: "소속",
                        formatter: (obj, key) => {
                          const { affiliation } = obj;
                          return <td key={key}>{affiliation}</td>;
                        },
                      },
                      {
                        key: "is_agreed_network_policy",
                        name: "명함",
                        formatter: (obj, key) => {
                          const { is_agreed_network_policy, idx } = obj;
                          const cardImage =
                            is_agreed_network_policy === "Y"
                              ? `url("${define.CDN_HOST}/assets/namecard_on.png")`
                              : `url("${define.CDN_HOST}/assets/namecard_off.png")`;
                          const cursor = is_agreed_network_policy
                            ? "pointer"
                            : "not-allowed";
                          return (
                            <td key={key}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (is_agreed_network_policy !== "Y")
                                    return null;
                                  setUserIndex(idx);
                                  triggerModal("business");
                                }}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  backgroundImage: cardImage,
                                  backgroundRepeat: "no-repeat",
                                  cursor,
                                }}
                              >
                                {" "}
                              </button>
                            </td>
                          );
                        },
                      },
                      {
                        key: "idx",
                        name: "1:1 채팅",
                        formatter: (user, key) => {
                          const { is_online_yn, email, idx } = user;
                          const icon =
                            is_online_yn === "Y"
                              ? "ico-invite-active.png"
                              : "ico-invite2.png";
                          const isRequesting = !!count[idx];
                          return (
                            <td key={key}>
                              <button
                                type="button"
                                onClick={() => {
                                  if (is_online_yn === "N") return null;
                                  inviteChat(user);
                                  // startWaitingTimer(idx);
                                }}
                                style={{
                                  width: "23px",
                                  height: "21px",
                                  backgroundImage: isRequesting
                                    ? "none"
                                    : `url("${define.CDN_HOST}/assets/${icon}")`,
                                  backgroundSize: "cover",
                                  cursor:
                                    is_online_yn === "Y"
                                      ? "pointer"
                                      : "not-allowed",
                                }}
                              >
                                {isRequesting ? count[idx] : " "}
                              </button>
                            </td>
                          );
                        },
                      },
                    ],
                    data: userList.list,
                    isPaginating: true,
                    baseNumber: 10,
                    totalSize: userList.totalSize,
                    onPaginationClick: (q) => getUserList(q),
                    defaultValue,
                  }}
                />
              </div>
            </div>
          </div>
          {subModalName && (
            <Component
              userInfo={
                subModalName === "business"
                  ? userList.list.filter((v) => v.idx === userIndex)
                  : null
              }
              handleClose={handleSubModalClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkLoungeModal;
