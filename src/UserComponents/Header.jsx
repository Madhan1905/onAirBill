import React, { useState } from "react";
import ToolBar from "./ToolBar.jsx";
import SideDrawer from "./SideDrawer";
import Backdrop from "./Backdrop";

const Header = (props) => {
  const [sideDrawerOpen,setSideDrawerOpen] = useState(false);
  
  const toggleDrawerHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const backDrawerHandler = () => {
    setSideDrawerOpen(false);
  };

  return (
    <div>
      <ToolBar onClickHandler={toggleDrawerHandler} {...props}/>
      {sideDrawerOpen && (
        <SideDrawer show={sideDrawerOpen} onClickHandler={toggleDrawerHandler} />
      )}
      {sideDrawerOpen && (
        <Backdrop onbackDrawerHandler={backDrawerHandler} />
      )}
    </div>
  );
}

export default Header;
