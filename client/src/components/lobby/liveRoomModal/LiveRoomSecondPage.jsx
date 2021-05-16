import React from "react";
import PropTypes from "prop-types";
import { isEmpty, isOpentime } from "../../../utils/helper";
import moment from "moment";
import styled from "styled-components";

const Btn = styled.button`
  background: ${(props) =>
    props.disable === true ? "#c7c7c7" : "#00bedc"} !important;
  cursor: ${(props) =>
    props.disable === true ? "default" : "pointer"} !important;
`;
const LiveRoomSecondPage = ({ list, handleRoute }) => {
  // console.log("list :: ", list);
  if (!list) return <></>;
  return (
    <div className="pr-table live-table">
      <ul className="pr-table__wrap">
        <li>
          <ul className="pr-table__row thead td_color1">
            <li className="pr-table__item1">시간</li>
            <li className="pr-table__item1-2">발표 주제 및 발표자</li>
            <li className="pr-table__item2">LIVE</li>
          </ul>
          {list.map((item) => {
            const { subject, idx, speaker, session_code } = item;
            // console.log("open_datetime ::", open_datetime);
            let { open_datetime, close_datetime } = item;
            open_datetime = moment
              .tz(open_datetime, "Asia/Seoul")
              .format("HH:mm");

            close_datetime = moment
              .tz(close_datetime, "Asia/Seoul")
              .format("HH:mm");

            let speakerTitle = "";
            let speakerName = "";

            if (!isEmpty(speaker.name_ko)) speakerName = speaker.name_ko;
            else if (!isEmpty(speaker.name_en)) speakerName = speaker.name_en;

            if (!isEmpty(speaker.title_ko)) speakerTitle = speaker.title_ko;
            else if (!isEmpty(speaker.title_en))
              speakerTitle = speaker.title_en;
            const isOpentimeTrue = isOpentime({
              open_datetime: moment(item.open_datetime).subtract(3, "m"),
              close_datetime: moment(item.close_datetime),
            });
            return (
              <ul key={idx} className="pr-table__row">
                <li className="pr-table__item1">
                  {open_datetime} - {close_datetime}
                </li>
                <li className="pr-table__item1-2">
                  {subject}
                  <span className="pr-table__speaker">
                    - {`${speakerName} ${speakerTitle}`} -
                  </span>
                </li>
                <li className="pr-table__item2">
                  <Btn
                    disabled={isOpentimeTrue ? false : true}
                    disable={isOpentimeTrue ? false : true}
                    onClick={() =>
                      handleRoute(`/liveRoom/${session_code}`, item)
                    }
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
  );
};

export default LiveRoomSecondPage;
