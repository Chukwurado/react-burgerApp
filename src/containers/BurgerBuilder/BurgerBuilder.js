import React, { Component } from "react";

import Aux from "../../hoc/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";

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
      ingredients: {
        salad: 0,
        bacon: 0,
        cheese: 0,
        meat: 0
      },
      totalPrice: 4,
      purchasable: false,
      purchasing: false
    };
  }

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

  purchaseContinueHandler = () => {
    alert("You Continued");
  };

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.modalClosed}>
          <OrderSummary
            ingredients={this.state.ingredients}
            purchaseCancelled={this.modalClosed}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.state.totalPrice}
          />
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          addMore={this.addIngredientHandler}
          removeIngredient={this.removeIngredientHandler}
          disabled={disabledInfo}
          price={this.state.totalPrice}
          purchasable={this.state.purchasable}
          ordered={this.purchaseHandler}
        />
      </Aux>
    );
  }
}

export default BurgerBuilder;
