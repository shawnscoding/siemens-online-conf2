import Axios from "axios";
import React, { useEffect, useState } from "react";
import { CDN_HOST } from "../../../../config/define";
import { sendTimeStamp } from "../../../../utils/helper";

const styles = {
  button: {
    width: "350px",
  },
};

const Brochure = ({ boothInfo, onClose, user }) => {
  const {
    brochure_list,
    brochure_cover_url_02,
    brochure_action_url_02,
  } = boothInfo;

  const handleDownload = (url) => {
    try {
      if (!url) return null;
      const link = document.createElement("a");

      link.href = url;
      let extention = url.split(".");
      extention = extention[extention.length - 1];
      // console.log("extention ::", extention);
      link.target = "_blank";
      if (link.download) {
        link.download = `brochure.${extention}`;

        document.body.appendChild(link);

        link.dispatchEvent(new MouseEvent("click"));
        document.body.removeChild(link);
      } else {
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      }
      // window.location.href = url;

      // Axios("https://khc2020-cdn.s3.ap-northeast-2.amazonaws.com/company/EH1_02_brochure_01.pdf").then(function (t) {
      //   return t.blob().then((b) => {
      //     var a = document.createElement("a");
      //     a.href = URL.createObjectURL(b);
      //     a.setAttribute("download", "test.pdf");
      //     a.click();
      //   });
      // });
    } catch (error) {
      console.log("Download Error!");
    }
  };

  const handleOpenTab = (url) => {
    try {
      if (!url) return null;
      const link = document.createElement("a");

      link.href = url;

      link.target = "_blank";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.log("Download Error!");
    }
  };

  const data = {
    company_idx: boothInfo.idx,
    user_idx: user.idx,
    user_action_type: "BROCHURE",
  };
  if (!brochure_list) return <></>;
  return (
    <div className="popup modal on">
      <div className="pop-tb">
        <div className="pop-cell zoomIn">
          <div
            style={{
              padding: "0 0 2rem 0",
            }}
            className="modal-box"
          >
            <div className="modal-header">
              <h2>Brochure</h2>
              <button type="button" className="close" onClick={onClose}>
                close
              </button>
            </div>
            <div className="pop-content">
              <div className="content-box" style={{ height: "100%" }}>
                <div style={{ height: "100%" }}>
                  <ul
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      textAlign: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {brochure_cover_url_02 && (
                      <button
                        type="button"
                        className="brochure_btn"
                        onClick={() => {
                          sendTimeStamp(data, "/userActionInBooth");
                          handleOpenTab(brochure_action_url_02);
                        }}
                        style={{
                          marginBottom: "50px",
                          marginRight: "50px",
                          ...styles.button,
                        }}
                      >
                        <img
                          alt="브로셔 이미지"
                          src={`${CDN_HOST}${brochure_cover_url_02}`}
                          style={{
                            width: "100%",
                          }}
                        />
                      </button>
                    )}
                    {brochure_list.map((brochure, i) => (
                      <button
                        key={brochure.brochure_cover_url}
                        type="button"
                        className="brochure_btn"
                        onClick={() => {
                          sendTimeStamp(data, "/userActionInBooth");

                          handleDownload(
                            `${CDN_HOST}/resources/companies/${brochure.brochure_action_url}`
                          );
                        }}
                        style={{
                          marginRight: i % 2 !== 0 ? "50px" : "",
                          marginBottom: "50px",
                          ...styles.button,
                        }}
                      >
                        <img
                          alt="브로셔 이미지"
                          src={`${CDN_HOST}/resources/companies/${brochure.brochure_cover_url}`}
                          style={{
                            width: "100%",
                          }}
                        />
                      </button>
                    ))}
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

export default Brochure;
