import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

const DrawerToggleButton = (props) => {
  return (
    <button className="toggle-button" onClick={props.click}>
      <FontAwesomeIcon icon={faList} className="fa-2x" />
    </button>
  );
};

export default DrawerToggleButton;
