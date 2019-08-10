import React, { Component } from "react";
import { Route, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

//import asyncComponent from "./hoc/asyncComponent";

import Layout from "./components/Layout/Layout";

import BurgerBuilder from "./containers/BurgerBuilder";
//import Checkout from "./containers/Checkout";
//import Orders from "./containers/Orders";
//import Auth from "./containers/Auth";
//import Logout from "./containers/Logout";
import * as actions from "./store/actions/index";

const Checkout = React.lazy(() => import("./containers/Checkout"));
const Orders = React.lazy(() => import("./containers/Orders"));
const Auth = React.lazy(() => import("./containers/Auth"));
const Logout = React.lazy(() => import("./containers/Logout"));

export class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    let routes = (
      <>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Route path="/" exact component={BurgerBuilder} />
          <Route path="/auth" exact component={Auth} />
          <Redirect to="/" />
        </React.Suspense>
      </>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Route path="/" exact component={BurgerBuilder} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/auth" exact component={Auth} />
            <Route path="/orders" exact component={Orders} />
            <Route path="/logout" exact component={Logout} />
          </React.Suspense>
        </>
      );
    }
    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
