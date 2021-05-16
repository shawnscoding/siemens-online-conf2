import React from "react";
import styles from "./styles.module.css";

const Radio = ({ name, checked, id, onChange, label }) => {
  return (
    <div className={styles["row"]}>
      <div className={styles["radio__container"]}>
        <input
          onChange={onChange}
          name={name}
          checked={checked}
          id={id}
          type="radio"
          className={styles["radio__input"]}
        />
        <div className={styles["radio__view"]}>
          <div className={styles["radio__circle"]}></div>
        </div>
        <div className={styles["radio__animator"]} />
      </div>
      <label className={styles["radio__label"]} htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

Radio.defaultProps = {
  checked: false,
};

export default Radio;
