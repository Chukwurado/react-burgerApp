import React, { Component } from "react";
import axios from "../../axios-orders";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler";

const INGREDIENT_PRICES = {
  salad: 0.5,
  bacon: 1,
  cheese: 0.5,
  meat: 1.5
};

export class BurgerBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ingredients: null,
      totalPrice: 4,
      purchasable: false,
      purchasing: false,
      loading: false,
      error: false
    };
  }

  componentDidMount = async () => {
    try {
      const res = await axios.get(
        "https://react-burger-e06fa.firebaseio.com/ingredients.json"
      );
      this.setState({
        ingredients: res.data
      });
    } catch (e) {
      this.setState({ error: true });
    }
  };

  updatePurchaseState = () => {
    const ingredients = {
      ...this.state.ingredients
    };
    const sum = Object.values(ingredients).reduce((a, b) => {
      return a + b;
    }, 0);

    this.setState({ purchasable: sum > 0 });
  };
  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredient = {
      ...this.state.ingredients,
      [type]: updatedCount
    };
    this.setState(
      {
        ...this.state,
        ingredients: updatedIngredient,
        totalPrice: this.state.totalPrice + INGREDIENT_PRICES[type]
      },
      this.updatePurchaseState
    );
  };

  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredient = {
      ...this.state.ingredients,
      [type]: updatedCount
    };
    this.setState(
      {
        ...this.state,
        ingredients: updatedIngredient,
        totalPrice: this.state.totalPrice - INGREDIENT_PRICES[type]
      },
      this.updatePurchaseState
    );
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  modalClosed = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = async () => {
    //alert("You Continued");

    const queryParams = [];
    for (const i in this.state.ingredients) {
      queryParams.push(
        encodeURIComponent(i) +
          "=" +
          encodeURIComponent(this.state.ingredients[i])
      );
    }
    queryParams.push("price=" + this.state.totalPrice);
    const queryString = queryParams.join("&");

    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryString
    });
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = (
      <>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          addMore={this.addIngredientHandler}
          removeIngredient={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </>
    );

    if (!this.state.ingredients) {
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
            this.state.ingredients && (
              <OrderSummary
                ingredients={this.state.ingredients}
                purchaseCancelled={this.modalClosed}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
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

export default withErrorHandler(BurgerBuilder, axios);
