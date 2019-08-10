import React, { Component } from "react";
import { connect } from "react-redux";

import axios from "../axios-orders";
import withErrorHandler from "../hoc/withErrorHandler";

import Order from "../components/Order/Order";
import Spinner from "../components/UI/Spinner/Spinner";
import * as actions from "../store/actions/index";

export class Orders extends Component {
  state = {
    orders: [],
    loading: true
  };
  async componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
    // try {
    //   const orders = await axios.get("/orders.json");
    //   const fetchedOrders = [];
    //   for (const key in orders.data) {
    //     fetchedOrders.push({ ...orders.data[key], id: key });
    //   }
    //   this.setState({
    //     loading: false,
    //     orders: fetchedOrders
    //   });
    // } catch (error) {
    //   this.setState({
    //     loading: false
    //   });
    // }
  }
  render() {
    let orders = <Spinner />;
    if (!this.props.loading) {
      orders = (
        <div>
          {this.props.orders.map(order => (
            <Order
              key={order.id}
              ingredients={order.ingredients}
              price={+order.price}
            />
          ))}
        </div>
      );
    }
    return orders;
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) =>
      dispatch(actions.fetchOrders(token, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
