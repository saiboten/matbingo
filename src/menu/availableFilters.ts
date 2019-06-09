import { RecipeType } from "../types";

export const availableFilters = () => [
  {
    name: "Kjøtt",
    testy: "recipeType",
    filter: (inputList: RecipeType[]) =>
      inputList.filter(el => el.recipetype && el.recipetype.includes("meat"))
  },
  {
    name: "Fisk",
    testy: "recipeType",
    filter: (inputList: RecipeType[]) =>
      inputList.filter(el => el.recipetype && el.recipetype.includes("fish"))
  },
  {
    name: "Vegetar",
    testy: "recipeType",
    filter: (inputList: RecipeType[]) =>
      inputList.filter(
        el => el.recipetype && el.recipetype.includes("vegetarian")
      )
  }
];
