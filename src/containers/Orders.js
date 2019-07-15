import React, { Component } from "react";

import axios from "../axios-orders";
import withErrorHandler from "../hoc/withErrorHandler";

import Order from "../components/Order/Order";

export class Orders extends Component {
  state = {
    orders: [],
    loading: true
  };
  async componentDidMount() {
    try {
      const orders = await axios.get("/orders.json");
      const fetchedOrders = [];
      for (const key in orders.data) {
        fetchedOrders.push({ ...orders.data[key], id: key });
      }
      this.setState({
        loading: false,
        orders: fetchedOrders
      });
    } catch (error) {
      this.setState({
        loading: false
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={+order.price}
          />
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axios);
