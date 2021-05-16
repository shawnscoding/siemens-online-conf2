import React from "react";
import CircularProgress from "../../../common/circularProgress/CircularProgress";
import moment from "moment";
import styled from "styled-components";
import { isEmpty, isOpentime } from "../../../../utils/helper";
import { LobbyContext } from "../../../../store/lobby/LobbyContext";

const DateBtn = styled.button`
  cursor: ${(props) =>
    props.disable === true ? "default" : "pointer"} !important;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 1500px;
  background: #f7f7f7;
  border-radius: 15px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 280px 0 0 0;
  align-items: flex-start;
`;
const trackCodeDics = {
  T1: "TRACK 1",
  T2: "TRACK 2",
  T3: "TRACK 3",
  T4: "TRACK 4",
};

const Btn = styled.button`
  background: ${(props) =>
    props.disable === true ? "#c7c7c7" : "#00bedc"} !important;
  cursor: ${(props) =>
    props.disable === true ? "default" : "pointer"} !important;
`;

const SpeakerRow = ({ subject, speaker, onClick }) => {
  const {
    name_ko,
    name_en,
    title_ko,
    title_en,
    affiliation_ko,
    affiliation_en,
    session_code,
  } = speaker;

  let name = "";
  let title = "";
  let affiliation = "";
  if (!isEmpty(name_ko)) name = name_ko;
  else if (!isEmpty(name_en)) name = name_en;

  if (!isEmpty(title_en)) title = `, ${title_en}`;
  else if (!isEmpty(title_ko)) title = ` ${title_ko}`;

  if (!isEmpty(affiliation_ko)) affiliation = ` (${affiliation_ko})`;
  else if (!isEmpty(affiliation_en)) affiliation = `, ${affiliation_en}`;

  if (session_code.slice(0, 2) === "SS")
    return (
      <ul className="pr-table__row">
        <li className="pr-table__item1"></li>
        <li className="pr-table__item1-2">
          {subject}
          <span className="pr-table__speaker">{`- ${name} ${title} -`}</span>
        </li>
        <li className="pr-table__item2">
          <button onClick={onClick} type="button" className="btn-summary">
            발표 소개
          </button>
        </li>
      </ul>
    );
  return (
    <ul className="pr-table__row">
      <li className="pr-table__item1"></li>
      <li className="pr-table__item1-2">{`${name}${title}${affiliation}`}</li>
      <li className="pr-table__item2">
        <button onClick={onClick} type="button" className="btn-summary">
          발표 소개
        </button>
      </li>
    </ul>
  );
};

const NotAuthTable = ({
  loading,
  setDate,
  selectedDate,
  generalSessions,
  sessionsByTime,
}) => {
  const { openNotAuthenticatedAlert } = React.useContext(LobbyContext);

  return (
    <div className="programme">
      <div style={{ marginBottom: 35 }} className="session-date-tap">
        <DateBtn
          disabled={loading}
          disable={loading}
          style={{ color: "white" }}
          type="button"
          onClick={() => setDate(1)}
          className={`date-tap ${selectedDate === 1 ? "on" : ""}`}
        >
          Day 1
        </DateBtn>
        <DateBtn
          disabled={loading}
          disable={loading}
          style={{ color: "white" }}
          type="button"
          onClick={() => setDate(2)}
          className={`date-tap ${selectedDate === 2 ? "on" : ""}`}
        >
          Day 2
        </DateBtn>
      </div>

      {loading ? (
        <ProgressContainer>
          <CircularProgress />
        </ProgressContainer>
      ) : (
        <>
          {generalSessions &&
            generalSessions.map((session) => {
              const { title, subject, speaker, action_type, idx } = session;
              let { open_datetime, close_datetime } = session;
              // console.log("open_datetime ::", open_datetime);

              // if t0 return one session for each time
              // if speaker, retrun second row
              // if subject, add span tag
              const isOpentimeTrue = isOpentime({
                open_datetime: moment(open_datetime).subtract(3, "m"),
                close_datetime,
              });
              open_datetime = moment
                .tz(open_datetime, "Asia/Seoul")
                .format("HH:mm");

              if (action_type === "break")
                return (
                  // <div key={idx} className="pr-table time">
                  //   <p className="pr-table__time">{open_datetime}</p>
                  //   <ul className="pr-table__wrap">
                  //     <li>
                  //       <ul className="pr-table__row  td_break">
                  //         <li className="pr-table__item1">General Session</li>
                  //         <li className="pr-table__item1-2">{title}</li>
                  //         <li className="pr-table__item2"></li>
                  //       </ul>
                  //     </li>
                  //   </ul>
                  // </div>
                  <></>
                );
              const route = generalSessions[0].session_code;
              return (
                <div key={idx} className="pr-table time">
                  {/* <p className="pr-table__time">{open_datetime}</p> */}
                  <ul className="pr-table__wrap">
                    <li>
                      <ul className="pr-table__row td_color1">
                        <li className="pr-table__item1">General Session</li>
                        <li className="pr-table__item1-2">{title}</li>
                        <li className="pr-table__item2">
                          <Btn
                            disable={isOpentimeTrue ? false : true}
                            onClick={openNotAuthenticatedAlert}
                            type="button"
                            className="btn-enter"
                          >
                            VOD 재생
                          </Btn>
                        </li>
                      </ul>
                      {speaker && (
                        <SpeakerRow
                          onClick={openNotAuthenticatedAlert}
                          speaker={speaker}
                          subject={subject}
                        />
                      )}
                    </li>
                  </ul>
                </div>
              );
            })}
          {sessionsByTime &&
            sessionsByTime.map((set) => {
              const openTime = moment.tz(set[0], "Asia/Seoul").format("HH:mm");
              const sessionList = set[1];
              // set[0] is openTime
              // set[1] is session list in that time
              const { open_datetime, close_datetime } = sessionList[0];
              const isOpentimeTrue = isOpentime({
                open_datetime: moment(open_datetime).subtract(3, "m"),
                close_datetime,
              });
              return (
                <div key={openTime} className="pr-table time">
                  {/* <p className="pr-table__time">{openTime}</p> */}
                  <ul className="pr-table__wrap">
                    {sessionList.map((session) => {
                      const {
                        title,
                        subject,
                        speaker,
                        track_code,
                        idx,
                      } = session;
                      const trackLabel = trackCodeDics[track_code.slice(0, 2)];
                      return (
                        <li key={idx}>
                          <ul className="pr-table__row td_color1">
                            <li className="pr-table__item1">
                              {trackLabel && trackLabel}
                            </li>
                            <li className="pr-table__item1-2">{title}</li>
                            <li className="pr-table__item2">
                              <Btn
                                disable={isOpentimeTrue ? false : true}
                                onClick={openNotAuthenticatedAlert}
                                type="button"
                                className="btn-enter"
                              >
                                VOD 재생
                              </Btn>
                            </li>
                          </ul>
                          {speaker && (
                            <SpeakerRow
                              speaker={speaker}
                              subject={subject}
                              onClick={openNotAuthenticatedAlert}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};

export default NotAuthTable;
