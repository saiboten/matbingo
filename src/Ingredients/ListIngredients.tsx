import React, { useEffect } from "react";
import { Ingredient } from "../types";
import { firebase } from "../firebase/firebase";

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
        <li key={el.name}>
          {el.name} - {el.unit}
        </li>
      ))}
    </ul>
  );
}
