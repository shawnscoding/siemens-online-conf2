import React from "react";
import { LobbyContext } from "../../../store/lobby/LobbyContext";
import { apiClient } from "../../../utils/data/api";

const StampTour = () => {
  const { setModalManager } = React.useContext(LobbyContext);
  const [stamps, setStamp] = React.useState([]);
  const [companiesByLocation, setCompaniesByLocation] = React.useState({
    location1: null,
    location2: null,
  });

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      stamp: {
        open: false,
      },
    }));
  };

  React.useEffect(() => {
    const getStamps = async () => {
      try {
        const companyRes = await apiClient.get("/company");
        if (!Array.isArray(companyRes.data)) return null;
        const stampRes = await apiClient.get("/stamp");
        if (!Array.isArray(stampRes.data.list)) return null;
        // create dics
        const dics = {};
        for (const item of stampRes.data.list) {
          dics[item.company_idx] = true;
        }

        // console.log(" stampRes.data.list ::", stampRes.data.list);
        // console.log("dics ::", dics);
        const _location1 = [];
        const _location2 = [];

        for (const item of companyRes.data) {
          if (item.location === 1) {
            if (dics[item.idx]) {
              _location1.push({ ...item, visited: true });
            } else {
              _location1.push({ ...item, visited: false });
            }
          }

          if (item.location === 2) {
            if (dics[item.idx]) {
              _location2.push({ ...item, visited: true });
            } else {
              _location2.push({ ...item, visited: false });
            }
          }
        }

        setCompaniesByLocation({
          location1: _location1,
          location2: _location2,
        });
      } catch (error) {
        console.error("getCompanyList error", error);
      }
    };

    getStamps();
  }, []);

  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2>Stamp Tour</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content stamp">
              <div className="content-box">
                <div className="stamp__stamp-box">
                  <div className="gift">
                    <p className="gift__banner">Starbucks Coffee Coupon</p>
                    <p className="gift__txt">
                      전시장 내 모든 부스를 방문하신 참가자분들께{" "}
                      <span className="txt-yellow">스타벅스 기프티콘</span>을
                      발송해드립니다!
                    </p>
                  </div>
                  <div className="stamp__list">
                    <ul className="stamp__section">
                      <li className="stamp__section-name">플래티넘</li>
                      <li className="stamp__booth-list">
                        <ul>
                          {companiesByLocation.location1 &&
                            companiesByLocation.location1.map((company) => (
                              <li
                                key={company.idx}
                                className="stamp__booth-item"
                              >
                                <p className="stamp__booth-name">
                                  {company.name}
                                </p>
                                <span
                                  className={company.visited ? "on" : ""}
                                ></span>
                              </li>
                            ))}
                        </ul>
                      </li>
                    </ul>
                    <ul className="stamp__section stamp__section--color2">
                      <li className="stamp__section-name">골드</li>
                      <li className="stamp__booth-list">
                        <ul>
                          {companiesByLocation.location2 &&
                            companiesByLocation.location2.map((company) => (
                              <li
                                key={company.idx}
                                className="stamp__booth-item"
                              >
                                <p className="stamp__booth-name">
                                  {company.name}
                                </p>
                                <span
                                  className={company.visited ? "on" : ""}
                                ></span>
                              </li>
                            ))}
                        </ul>
                      </li>
                    </ul>
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

export default StampTour;
