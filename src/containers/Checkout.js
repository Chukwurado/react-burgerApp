import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSummary from "../components/Order/CheckoutSummary";
import ContactData from "./ContactData";

export class Checkout extends Component {
  //   state = {
  //     ingredients: null,
  //     price: 0
  //   };

  //   componentWillMount() {
  //     const query = new URLSearchParams(this.props.location.search);
  //     const ingredients = {};
  //     let price = 0;
  //     for (let param of query.entries()) {
  //       //['salad', 1]
  //       if (param[0] === "price") {
  //         price = param[1];
  //       } else {
  //         ingredients[param[0]] = +param[1]; //convert to number
  //       }
  //     }
  //     this.setState({ ingredients, totalPrice: price });
  //   }

  checkoutCancelledHandler = () => {
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };
  render() {
    let summary = <Redirect to="/" />;

    if (this.props.ingredients) {
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/" />
      ) : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ingredients}
            checkoutCancelled={this.checkoutCancelledHandler}
            checkoutContinued={this.checkoutContinuedHandler}
          />
          <Route
            path={this.props.match.path + "/contact-data"}
            component={ContactData}
            //   render={props => (
            //     <ContactData
            //       {...props}
            //       ingredients={this.props.ingredients}
            //       price={this.props.totalPrice}
            //     />
            //   )}
          />
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
};

export default connect(mapStateToProps)(Checkout);
