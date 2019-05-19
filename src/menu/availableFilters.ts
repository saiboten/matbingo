import { RecipeType } from "../types";

export const availableFilters = () => [
  {
    name: "Kjøtt",
    filter: (inputList: RecipeType[]) =>
      inputList.filter(el => el.recipetype && el.recipetype.includes("meat"))
  },
  {
    name: "Fisk",
    filter: (inputList: RecipeType[]) =>
      inputList.filter(el => el.recipetype && el.recipetype.includes("fish"))
  },
  {
    name: "Vegetar",
    filter: (inputList: RecipeType[]) =>
      inputList.filter(
        el => el.recipetype && el.recipetype.includes("vegetarian")
      )
  }
];
