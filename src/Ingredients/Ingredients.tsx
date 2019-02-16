import React, { useReducer } from "react";

import { AddIngredient } from "./AddIngredient";
import { ListIngredients } from "./ListIngredients";
import { Ingredient } from "../types";

const initialState: Ingredient[] = [];

export function Ingredients() {
  return (
    <div>
      <AddIngredient />
      <ListIngredients />
    </div>
  );
}
