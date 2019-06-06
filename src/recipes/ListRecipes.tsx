import React from "react";
import Select from "react-select";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { RecipeContext } from "../context/RecipeContext";

interface Option {
  label: string;
  value: string;
}

interface Props {
  onChange: (opt: Option) => void;
}

export const ListRecipes = ({ onChange }: Props) => {
  const handleChange = (selectedOption: any) => {
    if (selectedOption.value !== "0") {
      onChange(selectedOption);
    }
  };

  return (
    <>
      <StyledHeaderH1>Finn oppskrift</StyledHeaderH1>
      <ul>
        <RecipeContext.Consumer>
          {({ recipes }) => (
            <Select
              value={{
                label: "Velg",
                value: "0"
              }}
              onChange={handleChange}
              options={recipes.map(el => ({
                label: el.name,
                value: el.id
              }))}
            />
          )}
        </RecipeContext.Consumer>
      </ul>
    </>
  );
};
