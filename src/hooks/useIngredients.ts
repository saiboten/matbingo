import { useState, useEffect, useContext } from "react";
import { firebase } from "../firebase/firebase";
import { Ingredient } from "../types";
import { UserDataContext } from "../context/UserDataContext";
import { IngredientsContext } from "../context/IngredientsContext";
import isEqual from "react-fast-compare";

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
      if (!userGroup) {
        return;
      }
      const db = firebase.firestore();
      db.collection("ingredients")
        .where("group", "==", userGroup)
        .onSnapshot(querySnapshot => {
          const incomingIngredients = querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
          }));

          if (!isEqual(ingredients, incomingIngredients)) {
            setIngredients(incomingIngredients);
          }

          setLoading(false);
        });
    },
    [userGroup, ingredients, setIngredients]
  );

  return [loading, ingredients];
};
