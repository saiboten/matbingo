import React, { useContext } from "react";
import styled from "styled-components";
import { RecipeType, Ingredient, Unit } from "../types";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import { IngredientsContext } from "../context/IngredientsContext";

const StyledWrapper = styled.div`
  margin-top: 2rem;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

interface Props {
  recipe: RecipeType;
}

const StyledUl = styled.ul`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const StyledLi = styled.li`
  display: inline-block;
  margin-right: 1.4rem;
`;

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`;

export const RecipeDetails = ({
  recipe: { name, description, ingredients }
}: Props) => {
  const ingredientsFromContext = useContext(IngredientsContext).ingredients;

  const ingredientsStrings: Ingredient[] = ingredients.map(ingredient => {
    const res = ingredientsFromContext.find(el => el.id === ingredient);
    return (
      res || {
        name: "",
        unit: "Units" as Unit,
        id: ""
      }
    );
  });

  return (
    <StyledWrapper>
      <StyledHeaderH1NoMarginTop>{name}</StyledHeaderH1NoMarginTop>
      {description && (
        <>
          <StyledEmpesizedP>Beskrivelse</StyledEmpesizedP>
          <p>{description}</p>
        </>
      )}
      <StyledEmpesizedP>Ingredienser</StyledEmpesizedP>
      <StyledUl>
        {ingredientsStrings.length > 0 && (
          <>
            {ingredientsStrings.map((i: any) => (
              <StyledLi key={i.name}>{i.name}</StyledLi>
            ))}
          </>
        )}
      </StyledUl>
    </StyledWrapper>
  );
};
