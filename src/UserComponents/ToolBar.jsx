import React, { useState } from "react";
import DrawerToggleButton from "./DrawerToggleButton";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCog,
  faUsers,
  faTruckMoving,
  faMoneyBillAlt,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import "./index.scss";
import AuthenticationService from '../Services/AuthenticationService';
import { useHistory } from "react-router";
import firebase from 'firebase/app';
import "firebase/auth"

const ToolBar = (props) => {

  const [showDropdown,setShowDropdown] = useState(false);
  const history = useHistory();

  return (
    <div>
    <header className="toolbar">
      <nav className="toolbar-navigation">
        <div className="toolbar-toggle-button">
          <DrawerToggleButton click={props.onClickHandler} />
        </div>
        <div className="toolbar-logo">
          <a href="/Dashboard">{sessionStorage.getItem("useData") ? JSON.parse(sessionStorage.getItem("useData")).organisationName : "On Air Bill"}</a>
        </div>
        <div className="spacer" />
        <div className="toolbar-navigation-items">
          <div className="d-flex">
        <div className="mr-3">HOME</div>
        <div className="mr-3" onClick={() => props.onClick("Feature")}>FEATURES</div>
        <div className="mr-3">PRICING</div>
        <div className="mr-3" onClick={() => props.onClick("about")}>ABOUT</div>
        <div><button className="login-button" onClick={() => props.onClick("login")}>LOGIN</button></div>
        </div>
        </div>
        {/* {(props.loggedIn || props.userStored || 1===1) &&<div className="toolbar-navigation-items"> */}
          {/* <ul style = {{alignItems: "baseline"}}>
            <li>
              <div className="toolbar-session">Session: <select className="toolbar-select">&nbsp;<option>2020-2021</option></select></div>
            </li>
            <li>
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                Options
              </button>
              <div className="dropdown-menu">
                <span 
                  className="dropdown-item"
                  onClick = {() => history.push("/Profile")}
                >
                    Profile
                </span>
                <span 
                  className="dropdown-item"
                  onClick = {() => {
                    firebase.auth().signOut().then(() => {
                      AuthenticationService.removeUserToken();
                      sessionStorage.clear();
                      window.location.replace("/login")
                    }).catch(err => {
                        console.log(err)
                    });
                  }}
                >
                  Logout
                </span>
              </div>
            </div> */}
            {/* <Button
              name="Logout"
              havingIcon={false}
              buttonType="btn btn-light"
              isRoundButton={true}
              onClick = {() => {
                AuthenticationService.removeUserToken();
                sessionStorage.clear();
                window.location.replace("/login")
              }}
            />   */}
            {/* </li>
          </ul>
        </div>} */}
      </nav>
    </header>
    {/* <nav className="toolbar-menu">
      <ul className="d-flex">
        <a className="navbar-button text-center" href="/dashboard">
          HOME
        </a>
        <a className="navbar-button text-center" href="/settings">
          FEATURES
        </a>
        <a className="navbar-button text-center" href="/customers"> 
          PRICING
        </a>
        <a className="navbar-button text-center" href="/transport">
          ABOUT
        </a>
        <a className="navbar-button text-center" href="/products">
          <button>login</button>
        </a>
      </ul>
    </nav> */}
    </div>
  );
};

export default ToolBar;
