import React from "react";
import { RecipeType } from "../types";

export const Recipe = (data: RecipeType) => (
  <div>
    <h1>{data.name}</h1>
    <p>{data.description}</p>
  </div>
);
