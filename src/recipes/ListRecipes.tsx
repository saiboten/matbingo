import React from "react";
import Select from "react-select";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { useRecipes } from "../hooks/useRecipes";
import { StyledLocalLoaderCentered } from "../components/StyledLocalLoader";

interface Option {
  label: string;
  value: string;
}

interface Props {
  onChange: (opt: Option) => void;
}

const customStyles = {
  menu: (provided: any, state: any) => ({
    ...provided,
    zIndex: 2,
  }),
};

export const ListRecipes = ({ onChange }: Props) => {
  const [recipesLoading, recipes] = useRecipes();

  const handleChange = (selectedOption: any) => {
    if (selectedOption.value !== "0") {
      onChange(selectedOption);
    }
  };

  if (recipesLoading) {
    return <StyledLocalLoaderCentered />;
  }

  return (
    <div style={{ maxWidth: "415px", margin: "0 auto", marginBottom: "2rem" }}>
      <StyledHeaderH1>Finn oppskrift</StyledHeaderH1>
      <ul>
        <Select
          styles={customStyles}
          value={{
            label: "Velg",
            value: "0",
          }}
          onChange={handleChange}
          options={recipes.map((el) => ({
            label: el.name,
            value: el.id,
          }))}
        />
      </ul>
    </div>
  );
};
