import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
import { ListRecipes } from "./ListRecipes";
import { StyledWrapper } from "../components/StyledWrapper";

export const ListRecipesAndRedirect = () => {
  const [nextPage, setNextPage] = useState("");

  useEffect(
    () => {
      setNextPage("");
    },
    [nextPage]
  );

  const optionSelected = ({ value }: { value: string }) => {
    if (value !== null) {
      setNextPage(value);
    }
  };

  if (nextPage !== "") {
    return <Redirect push to={`/recipes/${nextPage}`} />;
  }

  return (
    <StyledWrapper backgroundColor="white">
      <ListRecipes onChange={optionSelected} />
    </StyledWrapper>
  );
};
