import React, { useEffect, useState } from "react";
import { apiClient } from "../../../../utils/data/api";
import moment from "moment";
// import 'moment-range';
import "moment-timezone";

const BoothWaitingList = ({ setOpenWaitingList }) => {
  const [waitingList, setWaitingList] = useState([]);
  useEffect(() => {
    const getWaitingList = async () => {
      try {
        const res = await apiClient.get("/requestMeeting");
        console.log("res ::", res);
        setWaitingList(res.data);
      } catch (error) {
        console.error("getWaitingLsit", error);
      }
    };

    getWaitingList();
  }, []);

  return (
    <div className="popup modal  waiting on ">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>신청리스트</h2>
              <button
                type="button"
                className="close"
                onClick={() => {
                  setOpenWaitingList(false);
                }}
              >
                close
              </button>
            </div>
            <div className="pop-content" style={{ backgroundColor: "#fff" }}>
              <div className="waiting__wrap">
                <ul className="waitng__list">
                  {waitingList.length
                    ? waitingList.map((v) => {
                        return (
                          <li className="waiting__item" key={v.idx}>
                            <ul className="wating__userinfo">
                              <li className="waiting__name">
                                <span>이름</span>
                                <span>{v.name}</span>
                              </li>
                              <li className="waiting__mail">
                                <span>이메일</span>
                                <span>{v.email}</span>
                              </li>
                              <li className="waiting__mail">
                                <span>휴대폰</span>
                                <span>{v.mobile_no}</span>
                              </li>
                              <li className="waiting__term">
                                <span>희망 상담시간 / 내용</span>
                                <span>{v.comment}</span>
                              </li>
                              <li className="waiting__date">
                                <span>신청일자</span>
                                <span>
                                  {moment
                                    .tz(v.created_datetime, "Asia/Seoul")
                                    .format("YYYY-MM-DD HH:mm")}
                                </span>
                              </li>
                            </ul>
                          </li>
                        );
                      })
                    : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothWaitingList;
