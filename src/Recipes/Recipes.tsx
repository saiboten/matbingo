import React from "react";
import { ListRecipes } from "./ListRecipes";
import { AddRecipe } from "./AddRecipe";
import { StyledWrapper } from "../components/StyledWrapper";

export const Recipes = () => (
  <StyledWrapper>
    <ListRecipes />
    <AddRecipe />
  </StyledWrapper>
);
