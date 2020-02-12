import React from "react";
import { ShoppingListIngredient } from "../types";

export interface ShoppingListContextState {
  // shoppingList?: ShoppingListType;
  id?: string;
  group?: string;
  ingredients: ShoppingListIngredient[];
  setIngredients: (ingredients: any) => void;
  setId: (id: any) => void;
  setGroup: (group: any) => void;
}

const initalState: ShoppingListContextState = {
  id: undefined,
  group: undefined,
  ingredients: [],
  setIngredients: () => {},
  setId: () => {},
  setGroup: () => {}
};

export const ShoppingListContext = React.createContext(initalState);
