import React from "react";
import { Ingredient } from "../types";

export function ListIngredients({ state }: { state: Ingredient[] }) {
  return (
    <ul>
      {state.map(el => (
        <li key={el.name}>
          {el.name} - {el.unit}
        </li>
      ))}
    </ul>
  );
}
