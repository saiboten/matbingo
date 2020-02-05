import React, { useState, useContext } from "react";
import { availableFilters } from "./availableFilters";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { RecipeType } from "../types";
import { StyledInputLabel } from "../components/StyledInputLabel";
import Select from "react-select";
import { IngredientsContext } from "../context/IngredientsContext";

interface Props {
  activeFilters: any;
  setActiveFilters: any;
}

type FilterType = "recipeType" | "ingredient";

export interface Filter {
  name: string;
  filter: (list: RecipeType[]) => RecipeType[];
  testy: FilterType;
}

interface Option {
  value: string;
  label: string;
}

export const Filter = ({ activeFilters, setActiveFilters }: Props) => {
  const [open, setOpen] = useState(false);

  const { ingredients } = useContext(IngredientsContext);

  const handleChange = (selectedOptions: any) => {
    var newFilters = selectedOptions?.map((selectedOption: Option) => ({
      name: selectedOption.value,
      testy: "ingredient",
      filter: (list: RecipeType[]) =>
        list.filter(recipe => recipe.ingredients.includes(selectedOption.value))
    })) ?? [];

    const bla = [
      ...newFilters,
      ...activeFilters.filter((el: Filter) => el.testy !== "ingredient")
    ];

    setActiveFilters(bla);
  };

  if (!open) {
    return (
      <StyledActionButtonForText onClick={() => setOpen(true)}>
        Filtrer oppskrifter
      </StyledActionButtonForText>
    );
  }

  return (
    <div
      style={{ padding: "2rem", backgroundColor: "#fff", borderRadius: "5px" }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ marginBottom: "1rem" }}>Ingredienser</p>
        <Select
          placeholder="Velg ingredienser"
          onChange={handleChange}
          isMulti
          options={ingredients.map(({ name, id }) => ({
            label: name,
            value: id
          }))}
        />
      </div>
      <div
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: "1rem",
          justifyContent: "flex-start",
          flexWrap: "wrap"
        }}
      >
        {availableFilters().map((el: any) => (
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
    </div>
  );
};
