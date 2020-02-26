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

      const db = firebase.firestore();
      db.collection("recipes")
        .where("group", "==", userGroup)
        .onSnapshot(querySnapshot => {
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

export const useSingleRecipe = (
  id: string | undefined
): [boolean, RecipeType | undefined] => {
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<RecipeType | undefined>();
  const userGroup = useContext(UserDataContext).userdata.group;

  useEffect(
    () => {
      if (id === undefined) {
        setLoading(false);
        setRecipe(undefined);
        return;
      }

      const db = firebase.firestore();
      db.collection("recipes")
        .doc(id)
        .get()
        .then(doc => {
          const recipe: any = {
            id: doc.id,
            ...doc.data()
          };

          setRecipe(recipe);
          setLoading(false);
        });
    },
    [userGroup, id]
  );

  return [loading, recipe];
};
