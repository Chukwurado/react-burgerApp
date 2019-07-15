import React, { Component } from "react";
import axios from "../axios-orders";

import Button from "../components/UI/Button/Button";
import Spinner from "../components/UI/Spinner/Spinner";

import classes from "./ContactData.module.css";

export class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: ""
    },
    loading: false
  };

  orderHandler = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
      customer: {
        name: "Chukwurado Umeaka",
        address: {
          street: "TestStreet 1",
          zipCode: "12345",
          country: "US"
        },
        email: "test@test.com"
      },
      deliveryMethod: "fastest"
    };
    try {
      const res = await axios.post("/orders.json", order);
      this.setState({ loading: false });
      this.props.history.push("/");
    } catch (e) {
      this.setState({ loading: false });
    }
  };
  render() {
    let form = (
      <form>
        <input
          className={classes.input}
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <input
          className={classes.input}
          type="email"
          name="email"
          placeholder="Your Email"
        />
        <input
          className={classes.input}
          type="text"
          name="street"
          placeholder="Your Street"
        />
        <input
          className={classes.input}
          type="text"
          name="postal"
          placeholder="Your Zipcode"
        />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
