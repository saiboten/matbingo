import { useEffect, useState } from "react";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";

export const useRecipeImage = (recipe: RecipeType | undefined) => {
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (recipe?.image) {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const recipesRef = storageRef.child("recipes");
      const recipeRef = recipesRef.child(recipe?.id || "");
      recipeRef.getDownloadURL().then(function (url) {
        setImage(url);
      });
    } else {
      setImage("stock2.jpeg");
    }
  }, [recipe]);

  return { image, setImage };
};
