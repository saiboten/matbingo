import { useState, useEffect, useContext } from "react";
import { firebase } from "../firebase/firebase";
import { Ingredient } from "../types";
import { UserDataContext } from "../context/UserDataContext";

export const useIngredients = (): [boolean, Ingredient[]] => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Ingredient[]>([]);
  const userGroup = useContext(UserDataContext).userdata.group;

  useEffect(
    () => {
      const db = firebase.firestore();
      db.collection("ingredients")
        .where("group", "==", userGroup)
        .get()
        .then(querySnapshot => {
          setData(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
          setLoading(false);
        });
    },
    [data, userGroup]
  );

  return [loading, data];
};
