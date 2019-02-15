import React, { useContext, useEffect } from "react";
import { RecipeContext } from "../context/RecipeContext";
import { RouteComponentProps } from "react-router";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {}

export const RecipeDetails = ({
  match: {
    params: { id }
  }
}: Props) => {
  const recipes = useContext(RecipeContext);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes").onSnapshot(querySnapshot => {
      recipes.setRecipes(
        querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {};
  }, []);

  const recipeDetails: RecipeType = recipes.recipes.find(
    recipe => recipe.id === id
  ) || { name: "", description: "", id: "" };

  return (
    <div>
      <StyledHeaderH1>{recipeDetails.name}</StyledHeaderH1>
      <p>{recipeDetails.description}</p>
    </div>
  );
};
