import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const modalRoot = document.querySelector("#modal-root");

const PortalModal = ({ children }) => {
  return ReactDOM.createPortal(children, modalRoot);
};

PortalModal.propTypes = {};

export default PortalModal;
