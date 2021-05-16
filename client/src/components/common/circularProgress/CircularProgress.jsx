import React from "react";
import MuiCircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

const StyledCircularProgress = styled(MuiCircularProgress)`
  width: 40px !important;
  height: 40px !important;
  color: #0cc !important;
`;

const CircularProgress = () => {
  return <StyledCircularProgress />;
};

export default CircularProgress;
