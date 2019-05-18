import React, { useState } from "react";
import { availableFilters } from "./availableFilters";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { RecipeType } from "../types";

interface Props {
  activeFilters: any;
  setActiveFilters: any;
}

export interface Filter {
  name: string;
  filter: (list: RecipeType[]) => RecipeType[];
}

export const Filter = ({ activeFilters, setActiveFilters }: Props) => {
  return (
    <div style={{ backgroundColor: "white", padding: "1rem" }}>
      {availableFilters().map((el: any) => (
        <StyledActionButtonForText
          key={el.name}
          onClick={() => setActiveFilters([el, ...activeFilters])}
        >
          {el.name}
        </StyledActionButtonForText>
      ))}
    </div>
  );
};
