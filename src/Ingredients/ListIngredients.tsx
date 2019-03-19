import React, { useEffect, useContext } from "react";
import { firebase } from "../firebase/firebase";
import { StyledListItem } from "../components/StyledList";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { IngredientsContext } from "../context/IngredientsContext";
import { StyledDeleteIcon } from "../components/StyledSvgIcons";

function deleteIngredient(id: string) {
  const db = firebase.firestore();
  db.collection("ingredients")
    .doc(id)
    .delete();
}

export function ListIngredients() {
  return (
    <>
      <StyledHeaderH1>Ingredienser</StyledHeaderH1>
      <ul>
        <IngredientsContext.Consumer>
          {({ ingredients }) =>
            ingredients.map(el => (
              <StyledListItem key={el.id}>
                {el.name}
                <span onClick={() => deleteIngredient(el.id)}>
                  <StyledDeleteIcon />
                </span>
              </StyledListItem>
            ))
          }
        </IngredientsContext.Consumer>
      </ul>
    </>
  );
}
