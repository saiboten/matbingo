import React, { useEffect, useContext, useState } from "react";
import { firebase } from "../firebase/firebase";
import Select from "react-select";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { RecipeContext } from "../context/RecipeContext";
import { Redirect } from "react-router";
import { IngredientsContext } from "../context/IngredientsContext";

export const ListRecipes = () => {
  const recipes = useContext(RecipeContext);
  const ingredientsContext = useContext(IngredientsContext);

  const [selectedOption, setOption] = useState({
    label: "Velg",
    value: "0"
  });

  const handleChange = (selectedOption: any) => {
    setOption(selectedOption);
  };

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes").onSnapshot(querySnapshot => {
      recipes.setRecipes(
        querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });

    db.collection("ingredients").onSnapshot(querySnapshot => {
      ingredientsContext.setIngredients(
        querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {};
  }, []);

  if (selectedOption.value !== "0") {
    return <Redirect push to={`/recipes/${selectedOption.value}`} />;
  }

  return (
    <>
      <StyledHeaderH1>Finn oppskrift</StyledHeaderH1>
      <ul>
        <RecipeContext.Consumer>
          {({ recipes }) => (
            <Select
              value={selectedOption}
              onChange={handleChange}
              options={recipes.map(el => ({
                label: el.name,
                value: el.id
              }))}
            />
          )}
        </RecipeContext.Consumer>
      </ul>
    </>
  );
};
