import React, { Component } from "react";
import axios from "../axios-orders";
import { connect } from "react-redux";

import Burger from "../components/Burger/Burger";
import BuildControls from "../components/Burger/BuildControls/BuildControls";
import Modal from "../components/UI/Modal/Modal";
import OrderSummary from "../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../components/UI/Spinner/Spinner";
import withErrorHandler from "../hoc/withErrorHandler";
import * as actionTypes from "../store/actions";

export class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchasing: false,
      loading: false,
      error: false
    };
  }

  //   componentDidMount = async () => {
  //      try {
  //        const res = await axios.get(
  //          "https://react-burger-e06fa.firebaseio.com/ingredients.json"
  //        );
  //        this.setState({
  //          ingredients: res.data
  //        });
  //      } catch (e) {
  //        this.setState({ error: true });
  //      }
  //   };

  //   addIngredientHandler = type => {
  //     const oldCount = this.state.ingredients[type];
  //     const updatedCount = oldCount + 1;
  //     const updatedIngredient = {
  //       ...this.state.ingredients,
  //       [type]: updatedCount
  //     };
  //     this.setState(
  //       {
  //         ...this.state,
  //         ingredients: updatedIngredient,
  //         totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type]
  //       },
  //       this.updatePurchaseState
  //     );
  //   };

  //   removeIngredientHandler = type => {
  //     const oldCount = this.state.ingredients[type];
  //     if (oldCount <= 0) {
  //       return;
  //     }
  //     const updatedCount = oldCount - 1;
  //     const updatedIngredient = {
  //       ...this.state.ingredients,
  //       [type]: updatedCount
  //     };
  //     this.setState(
  //       {
  //         ...this.state,
  //         ingredients: updatedIngredient,
  //         totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type]
  //       },
  //       this.updatePurchaseState
  //     );
  //   };

  updatePurchaseState = () => {
    const ingredients = {
      ...this.props.ingredients
    };
    const sum = Object.values(ingredients).reduce((a, b) => {
      return a + b;
    }, 0);

    return sum > 0;
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  modalClosed = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.history.push("/checkout");

    //alert("You Continued");

    // const queryParams = [];
    // for (const i in this.props.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       "=" +
    //       encodeURIComponent(this.props.ingredients[i])
    //   );
    // }
    // queryParams.push("price=" + this.props.totalPrice);
    // const queryString = queryParams.join("&");

    // this.props.history.push({
    //   pathname: "/checkout",
    //   search: "?" + queryString
    // });
  };

  render() {
    const disabledInfo = {
      ...this.props.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = (
      <>
        <Burger ingredients={this.props.ingredients} />
        <BuildControls
          addMore={this.props.onIngredientAdded}
          removeIngredient={this.props.onIngredientRemoved}
          disabled={disabledInfo}
          price={this.props.totalPrice}
          purchasable={this.updatePurchaseState()}
          ordered={this.purchaseHandler}
        />
      </>
    );

    if (!this.props.ingredients) {
      burger = this.state.error ? (
        <p>Ingredient can't be loaded</p>
      ) : (
        <Spinner />
      );
    }
    return (
      <>
        <Modal show={this.state.purchasing} modalClosed={this.modalClosed}>
          {!this.state.loading ? (
            this.props.ingredients && (
              <OrderSummary
                ingredients={this.props.ingredients}
                purchaseCancelled={this.modalClosed}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.totalPrice}
              />
            )
          ) : (
            <Spinner />
          )}
        </Modal>
        {burger}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: name =>
      dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: name }),
    onIngredientRemoved: name =>
      dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: name })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
