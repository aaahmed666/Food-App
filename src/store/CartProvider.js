import React, { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalamount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalamount + action.item.price * action.item.amount;

    const exitingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const exitingCartItem = state.items[exitingCartItemIndex];
    let updatedItems;

    if (exitingCartItem) {
      const updatedItem = {
        ...exitingCartItem,
        amount: exitingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items];
      updatedItems[exitingCartItemIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return { items: updatedItems, totalamount: updatedTotalAmount };
  }

  if (action.type === "REMOVE") {
    const exitingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const exitingItem = state.items[exitingCartItemIndex];
    const updatedTotalAmount = state.totalamount - exitingItem.price;
    let updatedItems;
    if (exitingItem.amount === 1) {
      updatedItems = state.items.filter((item) => item.id !== action.id);
    } else {
      const updatedItem = { ...exitingItem, amount: exitingItem.amount - 1 };
      updatedItems = [...state.items];
      updatedItems[exitingCartItemIndex] = updatedItem;
    }
    return {
      items: updatedItems,
      totalamount: updatedTotalAmount,
    };
  }
  return defaultCartState;
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalamount: cartState.totalamount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
