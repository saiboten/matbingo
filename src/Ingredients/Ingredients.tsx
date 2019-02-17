import React from "react";

import { AddIngredient } from "./AddIngredient";
import { ListIngredients } from "./ListIngredients";

export function Ingredients() {
  return (
    <div>
      <AddIngredient />
      <ListIngredients />
    </div>
  );
}
