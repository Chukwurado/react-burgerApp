import React from "react";

import classes from "./Backdrop.module.css";

function Backdrop(props) {
  if (props.show) {
    return <div className={classes.Backdrop} onClick={props.clicked} />;
  }
  return null;
}

export default Backdrop;
