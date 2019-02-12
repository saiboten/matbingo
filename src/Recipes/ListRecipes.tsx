import React, { useEffect } from "react";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";

export const ListRecipes = ({
  state,
  dispatch
}: {
  state: any;
  dispatch: any;
}) => {
  useEffect(() => {
    const db = firebase.firestore();
    db.collection("ingredients")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          dispatch({ type: "addRecipe", ingredient: doc.data() });
        });
      });

    return () => {};
  }, []);

  <div>
    <h1>{data.name}</h1>
    <p>{data.description}</p>
  </div>;
};
