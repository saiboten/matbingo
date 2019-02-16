import React, { useEffect, useContext } from "react";
import { Ingredient } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledListItem } from "../components/StyledList";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { IngredientsContext } from "../context/IngredientsContext";

function deleteIngredient(id: string) {
  const db = firebase.firestore();
  db.collection("ingredients")
    .doc(id)
    .delete();
}
export function ListIngredients() {
  const ingredientsContext = useContext(IngredientsContext);

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("ingredients").onSnapshot(querySnapshot => {
      ingredientsContext.setIngredients(
        querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {};
  }, []);

  return (
    <>
      <StyledHeaderH1>Ingredienser</StyledHeaderH1>
      <ul>
        <IngredientsContext.Consumer>
          {({ ingredients }) =>
            ingredients.map(el => (
              <StyledListItem key={el.id}>
                {el.name} - {el.unit}
                <span onClick={() => deleteIngredient(el.id)}>Slett</span>
              </StyledListItem>
            ))
          }
        </IngredientsContext.Consumer>
      </ul>
    </>
  );
}
