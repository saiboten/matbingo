import React from "react";
import { RecipeType } from "../types";
import { Recipe } from "./Recipe";
import { AddRecipe } from "./AddRecipe";

const RecipeList = [
  {
    name: "Taco",
    description: "Taco! Yeah"
  }
];

export const Recipes = () => (
  <div>
    <AddRecipe />
    {RecipeList.map((taco: RecipeType) => (
      <Recipe key={taco.name} {...taco} />
    ))}
  </div>
);
