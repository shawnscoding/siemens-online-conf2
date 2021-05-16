import React from "react";
import styled from "styled-components";

const Td = styled.td`
  word-break: break-word !important;
`;

const styles = {
  card: {
    width: "64rem",
    height: "42rem",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
};
const BusinessCard = ({ userInfo, handleClose }) => {
  return (
    <div className="popup modal on">
      <div className="pop-tb" style={styles.card}>
        <div className="pop-cell zoomIn">
          <div className="modal-box">
            <div className="modal-header">
              <h2
                style={{
                  textTransform: "none",
                }}
              >
                Business Card
              </h2>
              <button type="button" className="close" onClick={handleClose}>
                close
              </button>
            </div>
            <div
              className="pop-content business-card"
              style={{ padding: "4rem 0" }}
            >
              <div className="content-box" style={{ padding: "1rem 3rem" }}>
                <div className="tb-wrap">
                  <table className="business-card-table">
                    <tbody>
                      <tr>
                        <Td>이름</Td>
                        <Td>{userInfo[0].name}</Td>
                      </tr>
                      <tr>
                        <Td>직함</Td>
                        <Td>{userInfo[0].title}</Td>
                      </tr>
                      <tr>
                        <Td>부서명</Td>
                        <Td>
                          {userInfo[0].department ? userInfo[0].department : ""}
                        </Td>
                      </tr>

                      <tr>
                        <Td>회사명</Td>
                        <Td>{userInfo[0].affiliation}</Td>
                      </tr>
                      <tr>
                        <Td>이메일</Td>
                        <Td>{userInfo[0].email}</Td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
