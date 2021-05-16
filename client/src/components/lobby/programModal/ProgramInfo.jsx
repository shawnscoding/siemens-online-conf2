import moment from "moment";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CDN_HOST } from "../../../config/define";
import { AuthContext } from "../../../store/auth/AuthContext";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import { apiClient } from "../../../utils/data/api";
import { isOpentime } from "../../../utils/helper";
import NotAuthTable from "./notAuthenticated/NotAuthTable";
import ProgramInfoTable from "./ProgramInfoTable";
import SpeakerPage from "./SpeakerPage";

const PAGE = {
  TABLE: "TABLE",
  SPEAKER: "SPEAKER",
};

const ProgramInfo = () => {
  const {
    modalManager: { programInfo },
    setModalManager,
    lobbyDatas: { day_no },
  } = React.useContext(LobbyContext);
  const { isAuthenticated } = React.useContext(AuthContext);
  // // rule for best performance
  // // - open/close shoud be implemented outside
  // // - fetch program and speaker should be implemented here
  // // - use useHistory for routing
  // // - page shoud be implemented here
  const { open } = programInfo;
  const [page, setPage] = React.useState(PAGE.TABLE);
  const [selectedDate, setDate] = React.useState(day_no.day_no);
  // // if 1, it's first day, if 2 second
  const [loading, setLoading] = React.useState(false);

  const [generalSessions, setGeneralSessions] = React.useState(null);
  const [sessionsByTime, setSessionsByTime] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const history = useHistory();
  const tableEl = React.useRef(null);
  const memoryOfScroll = React.useRef(0);
  // this holds the value of user's scroll for use when user revisits table
  const goToPrev = () => {
    setPage(PAGE.TABLE);
  };

  const goToSpeakPage = (_speaker) => {
    if (tableEl.current) {
      // preserve scroll val to memory
      memoryOfScroll.current = tableEl.current.scrollTop;
    }
    setProfile(_speaker);
    setPage(PAGE.SPEAKER);
  };

  const enterSessionPage = (route, isOpentime) => {
    // console.log("router ::", route);
    if (isOpentime) {
      setModalManager((prev) => ({
        ...prev,
        programInfo: {
          open: false,
        },
      }));
      history.push(route);
    }
  };

  const applyPreservedScrollTop = () => {
    if (tableEl.current) {
      tableEl.current.scrollTop = memoryOfScroll.current;
      // gives back memoryOfScroll val from memory to table El

      // console.log("step 1 memoryOfScroll.current :: ", memoryOfScroll.current);
    }
  };

  const onClose = () => {
    setModalManager((prev) => ({
      ...prev,
      programInfo: {
        open: false,
      },
    }));
  };

  React.useEffect(() => {
    const fetchConferenceData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/session?day_no=${selectedDate}`);
        console.log("res ::", res);
        const generalSessionList = [];
        const _sessionByTime = {};
        const sessionList = [];
        for (const item of res.data) {
          if (item.session_code.slice(0, 2) === "GS")
            generalSessionList.push(item);
          else {
            _sessionByTime[item.open_datetime] = [];
            sessionList.push(item);
          }
        }
        for (const item of sessionList) {
          _sessionByTime[item.open_datetime].push(item);
        }
        // console.log("sessionList ", sessionList);
        // console.log("_sessionByTime ", _sessionByTime);

        setGeneralSessions(generalSessionList);
        setSessionsByTime(Object.entries(_sessionByTime));
        setLoading(false);
      } catch (err) {
        console.log("fetchConferenceData error :", err);
        setLoading(false);
      }
    };
    fetchConferenceData();
  }, [selectedDate]);

  React.useEffect(() => {
    if (tableEl.current && page === PAGE.TABLE) {
      applyPreservedScrollTop();
      memoryOfScroll.current = 0;
    }
  }, [tableEl.current, page]);

  if (!open) return <></>;

  return (
    <div className="popup modal">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              {page === PAGE.SPEAKER && (
                <button onClick={goToPrev} className="prev">
                  prev
                </button>
              )}
              <h2>PROGRAM</h2>
              <button
                type="button"
                title="Close"
                onClick={onClose}
                className="close"
              >
                close
              </button>
            </div>
            <div ref={tableEl} className="pop-content data-table">
              <div className="content-box">
                {page === PAGE.SPEAKER && <SpeakerPage profile={profile} />}
                {page === PAGE.TABLE && isAuthenticated && (
                  <ProgramInfoTable
                    loading={loading}
                    setDate={setDate}
                    selectedDate={selectedDate}
                    generalSessions={generalSessions}
                    sessionsByTime={sessionsByTime}
                    enterSessionPage={enterSessionPage}
                    goToSpeakPage={goToSpeakPage}
                  />
                )}

                {page === PAGE.TABLE && !isAuthenticated && (
                  <NotAuthTable
                    loading={loading}
                    setDate={setDate}
                    selectedDate={selectedDate}
                    generalSessions={generalSessions}
                    sessionsByTime={sessionsByTime}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // return (
  //   <>
  //     <div className="popup modal">
  //       <div className="pop-tb">
  //         <div className="pop-cell zoomIn">
  //           <div className="modal-box">
  //             <div className="modal-header">
  //               <h2> PROGRAM</h2>
  //               <button type="button" onClick={onClose} className="close">
  //                 close
  //               </button>
  //             </div>
  //             <div className="pop-content data-table">
  //               <div className="content-box">
  //                 <div className="programme">
  //                   <div className="session-date-tap">
  //                     <button
  //                       onClick={() => setDate(1)}
  //                       style={{
  //                         color: "white",
  //                       }}
  //                       type="button"
  //                       className={`date-tap ${selectedDate === 1 ? "on" : ""}`}
  //                     >
  //                   4/7(수)
  //                     </button>
  //                     <button
  //                       onClick={() => setDate(2)}
  //                       style={{
  //                         color: "white",
  //                       }}
  //                       type="button"
  //                       className={`date-tap ${selectedDate === 2 ? "on" : ""}`}
  //                     >
  //                       4/8(목)
  //                     </button>
  //                   </div>
  //                   <div className="programme__day-wrap">
  //                     {selectedDate === 1 && (
  //                       <img
  //                         src={`${CDN_HOST}/assets/siemens/program-1.png`}
  //                         alt="siemens programme"
  //                       />
  //                     )}

  //                     {selectedDate === 2 && (
  //                       <img
  //                         src={`${CDN_HOST}/assets/siemens/program-2.png`}
  //                         alt="siemens programme"
  //                       ></img>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default ProgramInfo;
