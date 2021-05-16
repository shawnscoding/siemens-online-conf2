import React from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { AuthContext } from "../../store/auth/AuthContext";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import PassWord from "./Password";
import VideoChat from "../exhibition/booth/modal/VideoChat";
import { apiClient } from "../../utils/data/api";
import NetworkPrivayAgreement from "./NetworkPrivayAgreement";
import PromotionAgreement from "./PromotionAgreement";
import { getParticipants, isEmpty } from "../../utils/helper";

const ProfilePage = () => {
  const {
    modalManager: { myProfile },
    setModalManager,
  } = React.useContext(LobbyContext);
  const { open } = myProfile;
  const { user } = React.useContext(AuthContext);
  const [openMeeting, setOpenMeeting] = React.useState(false);
  const [boothInfo, setBoothInfo] = React.useState(null);
  const [currentStatus, setCurrentStatus] = React.useState("");
  const { email, name, affiliation, title } = user;
  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      myProfile: {
        open: false,
      },
    }));
  };

  React.useEffect(() => {
    if (open !== true || user.company_idx === -1) return;

    const getCompany = async () => {
      const { data } = await apiClient.get(`/company/${user.company_idx}`);
      setBoothInfo(data[0]);
    };
    getCompany();
  }, [open, currentStatus]);

  const openChat = async () => {
    try {
      if (boothInfo && boothInfo.idx) {
        // 기업 담당자
        const res = await getParticipants(boothInfo);
        const { users } = res.data;
        console.log("res in openChat ::", res);
        if (boothInfo.idx === user.company_idx) {
          if (users.length <= 1) return setOpenMeeting(true);
        }
      }
    } catch (error) {
      console.log("booth open chat Error ::", error);
    }
  };

  if (!open) return <></>;

  return (
    <>
      <div className="popup modal on">
        <div className="pop-tb">
          <div className="pop-cell zoomIn">
            <div className="modal-box">
              <div className="modal-header">
                <h2>My Page</h2>
                <button type="button" className="close" onClick={handleClose}>
                  close
                </button>
              </div>
              <div className="pop-content profile-info">
                <div className="content-box">
                  <div>
                    <Box p={5}>
                      <Grid container direction="column" justify="flex-start">
                        <Box>
                          <Typography variant="h3" gutterBottom>
                            <span>내 정보</span>
                          </Typography>
                          <div>
                            <dl>
                              <dt>ID (e-mail)</dt>
                              <dd>{email}</dd>
                            </dl>
                            <dl style={{ paddingTop: "1.5rem" }}>
                              <dt>이름</dt>
                              <dd>{name}</dd>
                            </dl>
                            <dl style={{ paddingTop: "1.5rem" }}>
                              <dt>직함</dt>
                              <dd>{title}</dd>
                            </dl>
                            <dl style={{ paddingTop: "1.5rem" }}>
                              <dt>회사명</dt>
                              <dd>{affiliation}</dd>
                            </dl>
                            {!isEmpty(user.company_idx) && (
                              <dl style={{ paddingTop: "1.5rem" }}>
                                <dt>상담방</dt>
                                <dd>
                                  <button
                                    id="1"
                                    type="button"
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      padding: "1.8rem 4rem",
                                      color: "#fff",
                                      fontSize: "2.1rem",
                                      textAlign: "center",
                                      fontWeight: "600px",
                                      background: "#2e315d",
                                      borderRadius: ".5rem",
                                      lineHeight: "1",
                                      textTransform: "uppercase",
                                    }}
                                    onClick={openChat}
                                  >
                                    입장
                                  </button>
                                </dd>
                              </dl>
                            )}
                          </div>
                        </Box>
                      </Grid>
                      <Grid>
                        <PassWord />
                      </Grid>
                      <Grid>
                        <NetworkPrivayAgreement />
                        <PromotionAgreement />
                      </Grid>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openMeeting ? (
        <VideoChat
          user={user}
          setBoothInfo={setBoothInfo}
          boothInfo={boothInfo}
          setOpenMeeting={setOpenMeeting}
        />
      ) : null}
    </>
  );
};

ProfilePage.propTypes = {};

export default ProfilePage;
