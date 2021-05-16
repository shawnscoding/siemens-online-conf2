import React, { useState, useEffect } from "react";

const Overview = ({ onClose }) => {
  const [overView, setOverView] = useState({
    name: "company name",
    ceo: "ceo",
    establishmentDate: "2020-01-01",
    equity: 500,
    sales: 10000,
    mainItem: "ddddd",
    companySize: 3,
    // hompage: "https://khc.mtnetworks.co.kr",
  });

  // get overView
  // useEffect(() => {}, [])

  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Overview</h2>
              <button type="button" className="close" onClick={onClose}>
                close
              </button>
            </div>
            <div
              className="pop-content"
              style={{
                padding: "4rem 0",
              }}
            >
              <div className="content-box" style={{ height: "100%" }}>
                <div>
                  <ul>
                    <li>
                      회사명:
                      {overView.name}
                    </li>
                    <li>
                      대표이사:
                      {overView.ceo}
                    </li>
                    <li>
                      법인설립일:
                      {overView.establishmentDate}
                    </li>
                    <li>
                      자본금:
                      {overView.equity}
                    </li>
                    <li>
                      매출액:
                      {overView.sales}
                    </li>
                    <li>
                      주력제품:
                      {overView.mainItem}
                    </li>
                    <li>
                      사업장 규모:
                      {overView.companySize}
                    </li>
                    <li>
                      홈페이지:
                      {overView.homepage}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
