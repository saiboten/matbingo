import { useState, useEffect, useContext } from "react";
import { firebase } from "../firebase/firebase";
import { Ingredient } from "../types";
import { UserDataContext } from "../context/UserDataContext";
import { IngredientsContext } from "../context/IngredientsContext";

export const useIngredients = (): [boolean, Ingredient[]] => {
  const [loading, setLoading] = useState(true);
  const { ingredients, setIngredients } = useContext(IngredientsContext);
  const userGroup = useContext(UserDataContext).userdata.group;

  useEffect(
    () => {
      if (ingredients.length > 0) {
        setLoading(false);
        return;
      }

      const db = firebase.firestore();
      db.collection("ingredients")
        .where("group", "==", userGroup)
        .get()
        .then(querySnapshot => {
          const ingredients = querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
          }));

          setIngredients(ingredients);
          setLoading(false);
        });
    },
    [userGroup, ingredients.length, setIngredients]
  );

  return [loading, ingredients];
};
