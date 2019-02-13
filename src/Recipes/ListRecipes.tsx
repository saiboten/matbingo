import React, { useEffect } from "react";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";

export const ListRecipes = ({
  state,
  dispatch
}: {
  state: RecipeType[];
  dispatch: any;
}) => {
  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          dispatch({ type: "addRecipe", key: doc.id, recipe: doc.data() });
        });
      });

    return () => {};
  }, []);

  return (
    <ul>
      {state.map(el => (
        <li key={el.id}>
          {el.name} - {el.description}
        </li>
      ))}
    </ul>
  );
};
