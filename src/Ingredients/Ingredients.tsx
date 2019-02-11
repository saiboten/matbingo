import React, { useReducer } from "react";

import { AddIngredient } from "./AddIngredient";
import { ListIngredients } from "./ListIngredients";
import { Ingredient } from "../types";

const IngredientsContext = React.createContext([]);

const initialState: Ingredient[] = [];

function reducer(state: any, action: any) {
  switch (action.type) {
    case "addIngredient":
      return [...state, action.ingredient];
    default:
      throw new Error();
  }
}

interface AppState {
  ingredients: Ingredient[];
}

export function Ingredients() {
  const [state, dispatch]: [Ingredient[], any] = useReducer(
    reducer,
    initialState
  );

  return (
    <div>
      <AddIngredient />
      <ListIngredients state={state} dispatch={dispatch} />
    </div>
  );
}
