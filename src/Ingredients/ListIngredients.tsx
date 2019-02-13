import React, { useEffect } from "react";
import { Ingredient } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledListItem } from "../components/StyledList";

export function ListIngredients({
  state,
  dispatch
}: {
  state: Ingredient[];
  dispatch: any;
}) {
  useEffect(() => {
    const db = firebase.firestore();
    db.collection("ingredients")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          dispatch({ type: "addIngredient", ingredient: doc.data() });
        });
      });

    return () => {};
  }, []);

  return (
    <ul>
      {state.map(el => (
        <StyledListItem key={el.name}>
          {el.name} - {el.unit}
        </StyledListItem>
      ))}
    </ul>
  );
}
