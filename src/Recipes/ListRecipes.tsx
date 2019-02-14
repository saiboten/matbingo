import React, { useEffect, useContext } from "react";
import { firebase } from "../firebase/firebase";
import { StyledListItemLink } from "../components/StyledList";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { RecipeContext } from "../context/RecipeContext";

function deleteItem(id: string) {
  const db = firebase.firestore();
  db.collection("recipes")
    .doc(id)
    .delete();
}

export const ListRecipes = () => {
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

  return (
    <>
      <StyledHeaderH1>Oppskrifter</StyledHeaderH1>
      <ul>
        <RecipeContext.Consumer>
          {({ recipes }) =>
            recipes.map((el: any) => {
              return (
                <StyledListItemLink key={el.id} to={`/recipes/${el.id}`}>
                  {el.name}
                  <div onClick={() => deleteItem(el.id)}>Slett</div>
                </StyledListItemLink>
              );
            })
          }
        </RecipeContext.Consumer>
      </ul>
    </>
  );
};
