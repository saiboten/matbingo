import React, { useState } from "react";
import { Redirect } from "react-router";
import { ListRecipes } from "./ListRecipes";

export const ListRecipesAndRedirect = () => {
  const [nextPage, setNextPage] = useState("");

  const optionSelected = ({ value }: { value: string }) => {
    if (value !== null) {
      setNextPage(value);
    }
  };

  if (nextPage !== "") {
    return <Redirect push to={`/recipes/${nextPage}`} />;
  }

  return <ListRecipes onChange={optionSelected} />;
};
