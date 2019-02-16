import React, { useContext, useEffect, useState } from "react";
import { RecipeContext } from "../context/RecipeContext";
import { RouteComponentProps, Redirect } from "react-router";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { primaryColor } from "../components/Constants";
import { StyledActionButton } from "../components/StyledActionButton";

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {}

function deleteItem(id: string, setNextPage: (nextPage: string) => void) {
  const db = firebase.firestore();
  db.collection("recipes")
    .doc(id)
    .delete();
  setNextPage("/");
}

export const RecipeDetails = ({
  match: {
    params: { id }
  }
}: Props) => {
  const recipes = useContext(RecipeContext);

  const [nextPage, setNextPage] = useState("");

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

  if (nextPage !== "") {
    return <Redirect push to={nextPage} />;
  }

  return (
    <div>
      <StyledHeaderH1>{recipeDetails.name}</StyledHeaderH1>
      <p>{recipeDetails.description}</p>
      <StyledActionButton
        onClick={() => deleteItem(recipeDetails.id, setNextPage)}
      >
        Slett oppskrift
      </StyledActionButton>
    </div>
  );
};
