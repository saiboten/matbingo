import React from "react";
import Select from "react-select";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { useRecipes } from "../hooks/useRecipes";
import { StyledLocalLoader } from "../components/StyledLocalLoader";

interface Option {
  label: string;
  value: string;
}

interface Props {
  onChange: (opt: Option) => void;
}

export const ListRecipes = ({ onChange }: Props) => {
  const [recipesLoading, recipes] = useRecipes();

  const handleChange = (selectedOption: any) => {
    if (selectedOption.value !== "0") {
      onChange(selectedOption);
    }
  };

  if (recipesLoading) {
    return <StyledLocalLoader />;
  }

  return (
    <>
      <StyledHeaderH1>Finn oppskrift</StyledHeaderH1>
      <ul>
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
      </ul>
    </>
  );
};
