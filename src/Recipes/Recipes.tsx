import React, { useEffect } from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";

export const Recipes = () => {
  return (
    <div>
      <AddRecipe />
      <ListRecipes />
    </div>
  );
};
