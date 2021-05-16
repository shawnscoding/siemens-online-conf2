import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../../store/auth/AuthContext";

import { LobbyContext } from "../../../store/lobby/LobbyContext";
import { apiClient } from "../../../utils/data/api";

const BrandingList = () => {
  // need to call server api
  const {
    modalManager: { branding },
    setModalManager,
  } = useContext(LobbyContext);
  const { open } = branding;
  const [sponsorList, setSponsorList] = useState(null);

  const handleClose = () => {
    setModalManager((prev) => ({
      ...prev,
      branding: {
        open: false,
      },
    }));
  };

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const res = await apiClient.get("/sponsor");
        setSponsorList(res.data);
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchSponsorData();
  }, []);

  if (!open) return <></>;
  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <button type="button" className="prev">
                prev
              </button>
              <h2>Branding List</h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div className="pop-content">
              <div className="content-box" />
              {sponsorList &&
                sponsorList.map((item) => (
                  <>
                    <img alt="" src={item.logo_url} key={item.idx} />
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={item.homepage_url}
                    >
                      click to go
                    </a>
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingList;
