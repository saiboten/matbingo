import React, { useState } from "react";
import { availableFilters } from "./availableFilters";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { RecipeType } from "../types";
import { StyledInputLabel } from "../components/StyledInputLabel";

interface Props {
  activeFilters: any;
  setActiveFilters: any;
}

export interface Filter {
  name: string;
  filter: (list: RecipeType[]) => RecipeType[];
}

export const Filter = ({ activeFilters, setActiveFilters }: Props) => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <StyledActionButtonForText onClick={() => setOpen(true)}>
        Filtrer oppskrifter
      </StyledActionButtonForText>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "white",
        padding: "1rem",
        justifyContent: "flex-start",
        flexWrap: "wrap"
      }}
    >
      {availableFilters().map((el: Filter) => (
        <StyledInputLabel key={el.name}>
          <input
            type="checkbox"
            onChange={() =>
              activeFilters.some(
                (activeFilter: Filter) => el.name === activeFilter.name
              )
                ? setActiveFilters(
                    activeFilters.filter(
                      (activeFilter: Filter) => el.name !== activeFilter.name
                    )
                  )
                : setActiveFilters([el, ...activeFilters])
            }
          />
          {el.name}
        </StyledInputLabel>
      ))}
      <StyledActionButtonForText
        style={{ marginLeft: "auto" }}
        onClick={() => setOpen(false)}
      >
        Lukk filtrering
      </StyledActionButtonForText>
    </div>
  );
};
