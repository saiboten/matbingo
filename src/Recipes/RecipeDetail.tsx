import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { RecipeType, Ingredient } from "../types";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { firebase } from "../firebase/firebase";

const StyledWrapper = styled.div`
  max-width: 480px;
`;

interface Props {
  recipe: RecipeType;
}

const StyledUl = styled.ul`
  text-align: left;
  display: inline-block;
  margin-top: 10px;
`;

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

export const RecipeDetails = ({
  recipe: { name, description, ingredients }
}: Props) => {
  const [ingredientsStrings, setIngredients]: any = useState([]);

  useEffect(
    () => {
      const db = firebase.firestore();

      const res = ingredients.map(el =>
        db
          .collection("ingredients")
          .doc(el)
          .get()
      );

      Promise.all(res).then(values => {
        setIngredients(values.map(el => el.data()));
      });
    },
    [ingredients]
  );

  return (
    <StyledWrapper>
      <StyledHeaderH1>{name}</StyledHeaderH1>
      {description && (
        <>
          <StyledEmpesizedP>Beskrivelse</StyledEmpesizedP>
          <p>{description}</p>
        </>
      )}
      <StyledUl>
        {ingredientsStrings.length > 0 && (
          <>
            <StyledEmpesizedP>Ingredienser</StyledEmpesizedP>
            {ingredientsStrings.map((i: Ingredient) => (
              <li key={i.name}>{i.name}</li>
            ))}
          </>
        )}
      </StyledUl>
    </StyledWrapper>
  );
};
