import React from "react";
import { Ingredient } from "../types";

export interface IngredientsContextState {
  ingredients: Ingredient[];
  setIngredients: any;
}

const initalState: IngredientsContextState = {
  ingredients: [],
  setIngredients: () => ({})
};

export const IngredientsContext = React.createContext(initalState);
