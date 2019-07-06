import React, { Component } from "react";

import Toolbar from "../Navigation/Toolbar";
import Aux from "../../hoc/Aux";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";

import classes from "./Layout.module.css";

class Layout extends Component {
  state = {
    showSideDrawer: false
  };

  closeSideDrawer = () => {
    this.setState({ showSideDrawer: false });
  };

  showDrawerToggle = () => {
    this.setState(prevState => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };
  render() {
    return (
      <Aux>
        <Toolbar DrawerToggleClicked={this.showDrawerToggle} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.closeSideDrawer}
        />
        <main className={classes.Content}>{this.props.children}</main>
      </Aux>
    );
  }
}

export default Layout;
