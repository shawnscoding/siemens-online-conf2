import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { LobbyContext } from "../../store/lobby/LobbyContext";
import styled from "styled-components";

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 2rem;
`;

const Btn = styled.button`
  display: inline-block;
  width: 12rem;
  margin: 0 0.6rem;
  height: 32px;
  padding: 0 0.8rem;
  background-color: #0cc;
  font-size: 1.6rem;
  line-height: 3.4rem;
  color: #fff;
  font-weight: 500;
  border-radius: 0.4rem;
  margin-bottom: 18px;
`;

const classes = {
  text: {
    display: "block",
    fontSize: "2.5rem",
    lineHeight: "3rem",
  },
};
const AlertModal = () => {
  const {
    handleAlertClose,
    modalManager: { alert },
  } = useContext(LobbyContext);
  const { msg, header, open, btns } = alert;
  // const utc = moment.utc("2020-07-28T12:08:17.000Z").format();

  // const local = moment.utc(utc).local().format("HH: mm");
  if (!open) return <></>;
  return (
    <>
      <div
        style={{
          zIndex: 999999,
        }}
        className="popup messagebox"
      >
        <div className="pop-tb schedule event">
          <div className="pop-cell zoomIn">
            <div className="login-box msg-box">
              <div className="msg-header">
                <h2>{header}</h2>
                <button className="close" onClick={handleAlertClose}>
                  close
                </button>
              </div>
              <div className="pop-content alert">
                <div
                  style={{
                    padding: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="alert-mess"
                >
                  <div>
                    {msg.split("\n").map((line, index) => {
                      return (
                        <p
                          style={
                            classes.text
                            //  textAlign: "center",
                            // verticalAlign: middle;
                          }
                          key={index}
                        >
                          {line}
                          <br />
                        </p>
                      );
                    })}
                  </div>
                </div>
                <div>
                  {btns && btns.length && (
                    <BtnWrapper>
                      {btns.map((btn) => (
                        <Btn
                          key={btn.label}
                          type="button"
                          onClick={btn.onClick}
                          className="btn-enter"
                        >
                          {btn.label}
                        </Btn>
                      ))}
                    </BtnWrapper>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

AlertModal.propType = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

AlertModal.defaultProps = {
  header: "Alert",
};

export default AlertModal;
