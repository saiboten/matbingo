import styled from "styled-components";
import React, { useState } from "react";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { Unit, Ingredient } from "../types";
import { useIngredients } from "../hooks/useIngredients";
import { StyledLocalLoader } from "../components/StyledLocalLoader";

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`;

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

interface Props {
  ingredientsIds: string[];
}

export const SeeIngredients: React.FC<Props> = props => {
  const [showIngredients, setShowIngredients] = useState(false);

  if (!showIngredients) {
    return (
      <StyledActionButtonForText
        style={{ marginTop: "1rem" }}
        onClick={() => setShowIngredients(true)}
      >
        Ingredienser
      </StyledActionButtonForText>
    );
  }

  return <SeeIngredientsOpen {...props} />;
};

export const SeeIngredientsOpen: React.FC<Props> = ({ ingredientsIds }) => {
  const [ingredientsLoading, ingredients] = useIngredients();

  const ingredientsStrings: Ingredient[] = ingredientsIds.map(ingredient => {
    const res = ingredients.find(el => el.id === ingredient);
    return (
      res || {
        name: "",
        unit: "Units" as Unit,
        id: ""
      }
    );
  });

  if (ingredientsLoading) {
    return <StyledLocalLoader />;
  }

  return (
    <>
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
    </>
  );
};
