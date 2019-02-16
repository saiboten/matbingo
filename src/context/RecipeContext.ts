import React from "react";
import { RecipeType } from "../types";

export interface RecipeContextState {
  recipes: RecipeType[];
  setRecipes: any;
}

const initalState: RecipeContextState = {
  recipes: [],
  setRecipes: () => ({})
};

export const RecipeContext = React.createContext(initalState);
