import React, { Component } from "react";

const asyncComponent = importantComponent => {
  return class extends Component {
    state = {
      component: null
    };

    async componentDidMount() {
      const cmp = await importantComponent();
      this.setState({ component: cmp.default });
    }
    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  };
};

export default asyncComponent;
