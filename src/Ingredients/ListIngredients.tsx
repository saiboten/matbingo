import React, { useEffect } from "react";
import { Ingredient } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledListItem } from "../components/StyledList";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";

function deleteIngredient(id: string) {
  const db = firebase.firestore();
  const recipes = db
    .collection("ingredients")
    .doc(id)
    .delete();
}
export function ListIngredients({
  state,
  dispatch
}: {
  state: Ingredient[];
  dispatch: any;
}) {
  useEffect(() => {
    const db = firebase.firestore();
    db.collection("ingredients").onSnapshot(querySnapshot => {
      dispatch({ type: "setIngredients", ingredients: querySnapshot.docs });
    });

    return () => {};
  }, []);

  return (
    <>
      <StyledHeaderH1>Ingredienser</StyledHeaderH1>
      <ul>
        {state.map(el => (
          <StyledListItem key={el.id}>
            {el.name} - {el.unit}
            <span onClick={() => deleteIngredient(el.id)}>Slett</span>
          </StyledListItem>
        ))}
      </ul>
    </>
  );
}
