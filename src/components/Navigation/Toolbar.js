import React from "react";

import Logo from "../../components/Logo/Logo";

import classes from "./Toolbar.module.css";
import NavigationItems from "../Navigation/NavigationItems/NavitionItems";
import DrawerToggle from "./SideDrawer/DrawerToggle/DrawerToggle";

function Toolbar(props) {
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.DrawerToggleClicked} />
      <div className={classes.Logo}>
        <Logo />
      </div>
      <nav className={classes.DesktopOnly}>
        <NavigationItems isAuthenticated={props.isAuth} />
      </nav>
    </header>
  );
}

export default Toolbar;
