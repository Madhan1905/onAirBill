import React from "react";
import "./index.scss";

const Backdrop = (props) => (
  <div className="backdrop" onClick={props.onbackDrawerHandler}></div>
);

export default Backdrop;
