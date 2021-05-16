import React from "react";
import { CDN_HOST } from "../../../config/define";
import styles from "./styles.module.css";

const NotificationPopup = ({ notification, onClose }) => {
  const handleOpenWebsite = (link) => {
    window.open(link, "_blank");
  };

  const { btns, content, header } = notification;

  return (
    <div className={styles["login-box"]}>
      <div className={styles["schedule-header"]}>
        <h2>{header ? header : "MESSAGE"}</h2>
        <p className={styles["mg-txt"]}>
          {content.split("\n").map((line, index) => {
            return (
              <span key={index}>
                {line}
                <br />
              </span>
            );
          })}
        </p>
        <button
          className={styles["close"]}
          type="button"
          onClick={onClose}
          titile="Close"
        >
          <img
            className={styles["close-img"]}
            alt="Close"
            src={`${CDN_HOST}/assets/ico-close.png`}
          />
        </button>
      </div>

      {btns &&
        btns.length > 0 &&
        btns.map((btn) => {
          const { url, id, content } = btn;
          return (
            <div key={id} className={styles["pop-content data-table"]}>
              <div className={styles["btn-hall"]}>
                <button
                  type="button"
                  onClick={() => {
                    handleOpenWebsite(url);
                  }}
                >
                  {content}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default NotificationPopup;
