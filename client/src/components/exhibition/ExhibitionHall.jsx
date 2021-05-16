import React, { useRef, useEffect, useState, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { LobbyContext } from "../../store/lobby/LobbyContext";
import { apiClient } from "../../utils/data/api";
import { AuthContext } from "../../store/auth/AuthContext";
import define from "../../config/define";
import useResize from "../../hooks/useResize";
import styled from "styled-components";

const Btn = styled.button`
  cursor: ${(props) => (props.disable ? "default" : "pointer")} !important;
`;

const classes = {
  booth4: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "394px",
    height: "261px",
    transform:
      "matrix3d(1, -0.08, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 129, 200, 0, 1)",
    transformOrigin: "left top 0px",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    borderBottomLeftRadius: "20%",
    borderBottomRightRadius: "8%",
    cursor: "pointer",
  },
  booth5: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "361px",
    height: "247px",
    transform:
      "matrix3d(1, -0.08, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 735, 200, 0, 1)",
    transformOrigin: "left top 0px",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    borderBottomLeftRadius: "20%",
    borderBottomRightRadius: "8%",
    cursor: "pointer",
  },
  booth6: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "373px",
    height: "242px",
    transform:
      "matrix3d(1, -0.08, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1278, 180, 0, 1)",
    transformOrigin: "left top 0px",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    borderBottomLeftRadius: "20%",
    borderBottomRightRadius: "48%",
    cursor: "pointer",
  },
  booth1: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "464px",
    height: "333px",
    transform:
      "matrix3d(1, -0.14, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 71, 651, 0, 1)",
    transformOrigin: "left top 0px",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    borderBottomLeftRadius: "49%",
    borderBottomRightRadius: "0%",
    cursor: "pointer",
  },
  booth2: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "426px",
    height: "333px",
    transform:
      "matrix3d(1, -0.08, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 791, 570, 0, 1)",
    transformOrigin: "left top 0px",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    borderBottomLeftRadius: "15%",
    borderBottomRightRadius: "0%",
    cursor: "pointer",
  },
  booth3: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "426px",
    height: "306px",
    transform:
      "matrix3d(1, -0.08, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1424, 512, 0, 1)",
    transformOrigin: "left top 0px",
    // backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    borderBottomLeftRadius: "15%",
    borderBottomRightRadius: "17%",
    borderTopRightRadius: "15%",
    cursor: "pointer",
  },
  searchBtn: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "200px",
    height: "45px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1700, 1000, 0, 1)",
    transformOrigin: "left top 0px",
    color: "#fff",
    zIndex: 1,
    fontSize: "2.1rem",
    textAlign: "center",
    fontWeight: "600",
    borderRadius: ".5rem",
    lineHeight: "1",
    textTransform: "uppercase",
    backgroundColor: "#2e315d",
  },
  moveBtn: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "200px",
    height: "45px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 800, 1000, 0, 1)",
    transformOrigin: "left top 0px",
    color: "#fff",
    zIndex: 1,
    fontSize: "2.1rem",
    textAlign: "center",
    fontWeight: "600",
    borderRadius: ".5rem",
    lineHeight: "1",
    textTransform: "uppercase",
  },
  moveBtn2: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "200px",
    height: "45px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1010, 1000, 0, 1)",
    transformOrigin: "left top 0px",
    color: "#fff",
    zIndex: 1,
    fontSize: "2.1rem",
    textAlign: "center",
    fontWeight: "600",
    borderRadius: ".5rem",
    lineHeight: "1",
    textTransform: "uppercase",
  },
  exit: {
    position: "absolute",
    left: "0px",
    top: "0px",
    width: "200px",
    height: "30px",
    transform: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1700, 50, 0, 1)",
    transformOrigin: "left top 0px",
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "transparent",
    zIndex: 1,
  },
};

const ExhibitionHall = ({ match }) => {
  const { setModalManager } = useContext(LobbyContext);
  const { isAuthenticated, loading } = useContext(AuthContext);
  const contentWrapRef = useRef(null);
  const { contentWrapStyle, contentResizeStyle } = useResize(contentWrapRef);
  const [companyList, setCompanyList] = useState([]);
  const history = useHistory();
  const { id } = match.params;

  useEffect(() => {
    const getCompanyList = async (id) => {
      try {
        const response = await apiClient.get(`/company?location=${id || 1}`);
        const { data } = response;
        if (!Array.isArray(data) || !data.length) return;
        setCompanyList(data);
      } catch (error) {
        console.error("getCompanyList error:: error");
      }
    };
    getCompanyList(id);
    return () => {};
  }, [id]);

  const getIntoBooth = (id) => {
    history.push({
      pathname: `/booth/${id}`,
    });
  };

  if (!loading && !isAuthenticated) return <Redirect to="/" />;

  return (
    <>
      <div className="exhibitionHall wrapper">
        <div className="content-wrap" style={contentWrapStyle}>
          <div
            className="canvas-wrap"
            ref={contentWrapRef}
            style={contentResizeStyle}
          >
            {companyList.length ? (
              <img
                alt="전시관 배경 화면"
                src={
                  +id === 1
                    ? define.RESOURCE.EXHIBITION_BACKGROUND_1
                    : define.RESOURCE.EXHIBITION_BACKGROUND_2
                }
                className="exhibitionHall_background"
              />
            ) : null}

            <div
              style={{ maxWidth: "128rem", display: "flex", flexWrap: "wrap" }}
            >
              {companyList.map((v, i) => (
                <Btn
                  disabled={!v.name}
                  disable={!v.name}
                  key={`${v.idx}`}
                  style={classes[`booth${i + 1}`]}
                  title={`booth${i + 1}`}
                  onClick={() => getIntoBooth(v.idx)}
                ></Btn>
              ))}
              <div style={classes.searchBtn}>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "inherit",
                    fontSize: "inherit",
                  }}
                  onClick={() =>
                    setModalManager((prev) => {
                      return {
                        ...prev,
                        exhibitorList: {
                          open: true,
                        },
                      };
                    })
                  }
                >
                  참여기업검색
                </button>
              </div>
              <div
                style={{
                  ...classes.moveBtn,
                  backgroundColor: id === "1" ? "#4d4de6" : "#2e315d",
                }}
              >
                <button
                  // todo button width/height 100%
                  type="button"
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "inherit",
                    fontSize: "inherit",
                  }}
                  onClick={() => history.push("/exhibition/1")}
                >
                  플래티넘
                </button>
              </div>
              <div
                style={{
                  ...classes.moveBtn2,
                  backgroundColor: id === "2" ? "#4d4de6" : "#2e315d",
                }}
              >
                <button
                  type="button"
                  style={{
                    width: "100%",
                    height: "100%",
                    color: "inherit",
                    fontSize: "inherit",
                  }}
                  onClick={() => history.push("/exhibition/2")}
                >
                  골드
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ExhibitionHall.propTypes = {};

export default ExhibitionHall;
