import React from "react";
import { Ingredient } from "../types";

export interface IngredientsContextState {
  ingredients: Ingredient[];
  setIngredients: any;
}

const initialState: IngredientsContextState = {
  ingredients: [],
  setIngredients: () => ({})
};

export const IngredientsContext = React.createContext(initialState);
