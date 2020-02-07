import React from "react";
import { firebase } from "../firebase/firebase";
import { StyledListItem } from "../components/StyledList";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledDeleteIcon } from "../components/StyledSvgIcons";
import { useIngredients } from "../hooks/useIngredients";
import { StyledLocalLoader } from "../components/StyledLocalLoader";

function deleteIngredient(id: string) {
  const db = firebase.firestore();
  db.collection("ingredients")
    .doc(id)
    .delete();
}

export function ListIngredients() {
  const [ingredientsLoading, ingredients] = useIngredients();

  if (ingredientsLoading) {
    return <StyledLocalLoader />;
  }

  return (
    <>
      <StyledHeaderH1>Ingredienser</StyledHeaderH1>
      <ul>
        {ingredients.map(el => (
          <StyledListItem key={el.id}>
            {el.name}
            <span onClick={() => deleteIngredient(el.id)}>
              <StyledDeleteIcon />
            </span>
          </StyledListItem>
        ))}
      </ul>
    </>
  );
}
