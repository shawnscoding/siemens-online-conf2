import React from "react";
import PropTypes from "prop-types";
import { trackLabelDic } from "./VodRoomListModal";
import moment from "moment";
import styled from "styled-components";
import { isOpentime } from "../../../utils/helper";

const Btn = styled.button`
  background: ${(props) =>
    props.disable === true ? "#c7c7c7" : "#00bedc"} !important;
  cursor: ${(props) =>
    props.disable === true ? "default" : "pointer"} !important;
`;

const FirstPage = ({ obj, onClickTrack, handleRoute }) => {
  if (!obj) return <></>;
  const { generalSessions, tracks } = obj;
  if (!generalSessions || !tracks) return <></>;
  return (
    <>
      <div className="programme__day-wrap">
        <div className="pr-table live-table">
          <ul
            style={{
              marginBottom: "2rem",
            }}
            className="pr-table__wrap"
          >
            <li>
              <ul className="pr-table__row thead td_color1">
                <li className="pr-table__item1">시간</li>
                <li className="pr-table__item1-2">발표 주제 및 발표자</li>
                <li className="pr-table__item2">LIVE</li>
              </ul>
              {generalSessions.map((session) => {
                const { title, action_type, session_code } = session;
                let { open_datetime, close_datetime } = session;
                const isOpentimeTrue = isOpentime({
                  open_datetime: moment(open_datetime).subtract(3, "m"),
                  close_datetime,
                });

                // console.log("open_datetime ::", open_datetime);
                open_datetime = moment
                  .tz(open_datetime, "Asia/Seoul")
                  .format("HH:mm");
                close_datetime = moment
                  .tz(close_datetime, "Asia/Seoul")
                  .format("HH:mm");

                if (action_type === "break")
                  return (
                    <ul key={session.idx} className="pr-table__row td_break">
                      <li className="pr-table__item1">
                        {open_datetime} - {close_datetime}
                      </li>

                      <li className="pr-table__item1-2">{`${title}`}</li>
                      <li className="pr-table__item2"></li>
                    </ul>
                  );
                const firstGeneralSessionCode = generalSessions[0].session_code;

                return (
                  <ul key={session.idx} className="pr-table__row">
                    <li className="pr-table__item1">
                      {open_datetime} - {close_datetime}
                    </li>

                    <li className="pr-table__item1-2">{`${title}`}</li>
                    <li className="pr-table__item2">
                      <Btn
                        // edit 1-2
                        disable={isOpentimeTrue ? false : true}
                        // disable={false}
                        disabled={isOpentimeTrue ? false : true}
                        onClick={() =>
                          handleRoute(`/vodRoom/${firstGeneralSessionCode}`)
                        }
                        type="button"
                        className="btn-enter"
                      >
                        입장
                      </Btn>
                    </li>
                  </ul>
                );
              })}
            </li>
            <li className="pr-table__track">
              {tracks.map((track) => {
                const { title, track_code } = track;
                // console.log("open_datetime ::", open_datetime);
                let { open_datetime, close_datetime } = obj;
                const isOpentimeTrue = isOpentime({
                  open_datetime: moment(open_datetime).subtract(3, "m"),
                  close_datetime,
                });
                open_datetime = moment
                  .tz(open_datetime, "Asia/Seoul")
                  .format("HH:mm");
                close_datetime = moment
                  .tz(close_datetime, "Asia/Seoul")
                  .format("HH:mm");

                const trackLabel = trackLabelDic[track_code.slice(0, 2)];
                return (
                  <ul key={track.idx} className="pr-table__row">
                    <li className="pr-table__item1">
                      {open_datetime} - {close_datetime}
                    </li>
                    <li className="pr-table__item1-2">
                      <span className="span-track1">
                        {" "}
                        {trackLabel && trackLabel}
                      </span>
                      {title}
                    </li>
                    <li className="pr-table__item2">
                      <Btn
                        // edit 1-2
                        disable={isOpentimeTrue ? false : true}
                        // disable={false}
                        type="button"
                        onClick={() => onClickTrack(track_code)}
                        className="btn-enter"
                      >
                        입장
                      </Btn>
                    </li>
                  </ul>
                );
              })}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default FirstPage;
