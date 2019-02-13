import React, { useReducer } from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";
import { RecipeType } from "../types";

function reducer(state: RecipeType[], action: any) {
  switch (action.type) {
    case "setRecipes":
      return action.recipes.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    default:
      throw new Error();
  }
}

const initialState: RecipeType[] = [];

export const Recipes = () => {
  const [state, dispatch]: [RecipeType[], any] = useReducer(
    reducer,
    initialState
  );

  return (
    <div>
      <AddRecipe />
      <ListRecipes state={state} dispatch={dispatch} />
    </div>
  );
};
