import { useState, useEffect, useContext } from "react";
import { firebase } from "../firebase/firebase";
import { RecipeType } from "../types";
import { UserDataContext } from "../context/UserDataContext";
import { RecipeContext } from "../context/RecipeContext";

export const useRecipes = (): [boolean, RecipeType[]] => {
  const [loading, setLoading] = useState(true);
  const { recipes, setRecipes } = useContext(RecipeContext);
  const userGroup = useContext(UserDataContext).userdata.group;

  useEffect(
    () => {
      if (recipes.length > 0) {
        setLoading(false);
        return;
      }

      console.log("userecipes", recipes);

      const db = firebase.firestore();
      db.collection("recipes")
        .where("group", "==", userGroup)
        .get()
        .then(querySnapshot => {
          const ingredients = querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
          }));

          setRecipes(ingredients);
          setLoading(false);
        });
    },
    [userGroup, recipes, setRecipes]
  );

  return [loading, recipes];
};
