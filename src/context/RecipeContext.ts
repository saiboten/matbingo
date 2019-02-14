import React from "react";
import { RecipeType } from "../types";

export interface ContextState {
  recipes: RecipeType[];
  setRecipes: any;
}

const initalState: ContextState = {
  recipes: [],
  setRecipes: () => ({})
};

export const RecipeContext = React.createContext(initalState);
