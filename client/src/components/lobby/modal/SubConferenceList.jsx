import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import { apiClient } from "./../../../utils/data/api";

const styles = {
  tap: {
    selected: { backgroundColor: "#009cdb" },
    basic: { backgroundColor: "#939393" },
  },
};

const SubConferenceList = () => {
  // need to call server api
  const {
    modalManager: { subConference },
    setModalManager,
  } = useContext(LobbyContext);
  const history = useHistory();
  const { open } = subConference;
  const [subConferenceList, setSubConferenceList] = useState([]);
  const [date, setDate] = useState(1); // 1은 목요일, 2는 금요일  임의로 세팅.

  useEffect(() => {
    const getSubConferenceList = async () => {
      try {
        const res = await apiClient.get(
          `/session?session_type=sub&day_no=${date}`
        );
        if (!Array.isArray(res.data)) return "";
        setSubConferenceList(res.data);
      } catch (error) {
        console.error("set subconferene list error :", error);
      }
    };
    getSubConferenceList();
  }, [date]);

  const handleDateTap = (date) => {
    setDate(date);
  };

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      subConference: {
        open: false,
      },
    }));
  };

  const handleDirect = (param) => {
    if (!param) throw Error("bad param type");
    history.push(`/subConference/${param}`);
    handleClose();
  };

  if (!open) return <></>;
  return (
    <div className="popup modal on">
      <div className="pop-tb pop-sl">
        <div className="pop-cell zoomIn">
          <div
            className="modal-box"
            style={{ maxHeight: "77rem", overflowY: "auto" }}
          >
            <div className="modal-header">
              <h2>VOD Session List</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content">
              <div className="content-box" style={{ padding: "0 20px" }}>
                <div className="session-date-tap">
                  <div
                    className="date-tap"
                    style={date === 1 ? styles.tap.selected : styles.tap.basic}
                    onClick={() => handleDateTap(1)}
                  >
                    11/26(목)
                  </div>
                  <div
                    className="date-tap"
                    style={date === 2 ? styles.tap.selected : styles.tap.basic}
                    onClick={() => handleDateTap(2)}
                  >
                    11/27(금)
                  </div>
                </div>
                <div className="session-list-table">
                  <div className="tb-wrap">
                    <table>
                      <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "52%" }} />
                        <col style={{ width: "23%" }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th scope="col">세션명</th>
                          <th scope="col">세션 주제</th>
                          <th scope="col"> - </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subConferenceList?.map((subconf, idx) => {
                          const subjectArr = subconf.subject.split(
                            /\((.*?)\)/g
                          );

                          return (
                            <tr key={idx}>
                              <td>{subconf.subject}</td>
                              <td>{subconf.title}</td>
                              <td>
                                <button
                                  className="session-list-enter-btn"
                                  onClick={() => handleDirect(subconf.idx)}
                                >
                                  입장
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <span>
                      ※ 행사 종료 후 '자료배포동의(14일)'에 동의하지 않은
                      강연자의 영상은 행사 종료 이후 다시보기가 불가능합니다.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SubConferenceList.propTypes = {
  subConferenceList: PropTypes.array,
};

SubConferenceList.defaultProps = {
  subConferenceList: null,
};

export default SubConferenceList;
