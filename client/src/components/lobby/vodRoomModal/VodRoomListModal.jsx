import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import { apiClient } from "../../../utils/data/api";
import Header from "./Header";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";

export const trackLabelDic = {
  T1: "TRACK 1",
  T2: "TRACK 2",
  T3: "TRACK 3",
  T4: "TRACK 4",
};

const VodRoomListModal = () => {
  // need to call server api
  const {
    setModalManager,
    lobbyDatas: { day_no },
  } = React.useContext(LobbyContext);
  const history = useHistory();
  const [selectedDate, setDate] = React.useState(day_no.day_no || 1);
  // if 1, it's first day, if 2 second
  const [page, setPage] = React.useState(1);
  const [selectedTrack, setTrack] = React.useState(null);
  const [firstPageData, setFirstPageData] = React.useState(null);
  const [secondPageData, setSecondPageData] = React.useState(null);

  React.useEffect(() => {
    const getSessions = async () => {
      try {
        const res = await apiClient.get(`/session?day_no=${selectedDate}`);
        let list = res.data;
        const _firstPage = {
          generalSessions: [],
          tracks: [],
        };
        const memo = {};
        let generalSessionCount = 0;

        for (let i = 0; i < list.length; i++) {
          // if track is 'T0' push everything
          // if not, store each track and break for loop
          // count general session for slicing
          const slicedTrackCode = list[i].track_code.slice(0, 2);

          if (slicedTrackCode === "T0") {
            _firstPage.generalSessions.push(list[i]);
            generalSessionCount++;
          } else {
            if (memo[slicedTrackCode]) break;
            else {
              _firstPage.tracks.push(list[i]);
              memo[slicedTrackCode] = true;
            }
          }
        }

        // console.log("list ::", list);
        // -store open_datetime from list[0] and close from list[length -1]
        list = list.slice(generalSessionCount, list.length);

        _firstPage.open_datetime = list[0].open_datetime;
        _firstPage.close_datetime = list[list.length - 1].close_datetime;

        // get track session from open_datetime to close_datetime
        // console.log("memo ::", memo);
        // console.log("list ::", list);
        // console.log("_firstPage ::", _firstPage);
        const _secondPage = {};
        for (let i = 0; i < list.length; i++) {
          // if track is T0 push everything
          // if not, store each track and break for loop

          if (!_secondPage[list[i].track_code])
            _secondPage[list[i].track_code] = [list[i]];
          else _secondPage[list[i].track_code].push(list[i]);
        }
        // if(i  === 0) _secondPage.open_datetime = list[i].start

        // console.log("_secondPage ::", _secondPage);

        setFirstPageData(_firstPage);
        setSecondPageData(_secondPage);
      } catch (error) {
        // setSessions(defaultSession);

        setFirstPageData(null);
        setSecondPageData(null);
        console.error("set subconferene list error :", error);
      }
    };
    getSessions();
  }, [selectedDate]);

  const onClose = () => {
    setModalManager((prev) => ({
      ...prev,
      vodRoom: {
        open: false,
      },
    }));
  };

  const handleRoute = (route) => {
    history.push(route);
    onClose();
  };

  const onClickTrack = (track_code) => {
    setTrack(track_code);
    setPage(2);
  };

  const onPrev = () => {
    setPage(1);
    setTrack(null);
  };

  return (
    <>
      <div className="popup modal">
        <div className="pop-tb">
          <div className="pop-cell zoomIn">
            <div className="modal-box">
              <Header
                page={page}
                onPrev={onPrev}
                onClose={onClose}
                list={secondPageData && secondPageData[selectedTrack]}
              />
              <div className="pop-content data-table">
                <div className="content-box">
                  <div className="programme">
                    {page === 1 && (
                      <div className="session-date-tap">
                        <>
                          <button
                            type="button"
                            onClick={() => setDate(1)}
                            style={{ color: "white" }}
                            className={`date-tap ${
                              selectedDate === 1 ? "on" : ""
                            }`}
                          >
                            4/7(수)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDate(2)}
                            style={{ color: "white" }}
                            className={`date-tap ${
                              selectedDate === 2 ? "on" : ""
                            }`}
                          >
                            4/8(목)
                          </button>
                        </>
                      </div>
                    )}
                    {page === 1 && (
                      <FirstPage
                        onClickTrack={onClickTrack}
                        obj={firstPageData}
                        handleRoute={handleRoute}
                      />
                    )}
                    {page === 2 && (
                      <SecondPage
                        handleRoute={handleRoute}
                        selectedTrack={selectedTrack}
                        list={secondPageData && secondPageData[selectedTrack]}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const VodRoomListModalContainer = () => {
  const { lobbyDatas } = React.useContext(LobbyContext);

  if (!lobbyDatas.day_no) return <></>;
  return <VodRoomListModal />;
};

export default VodRoomListModalContainer;
