import React, { useEffect, useContext, useState } from "react";
import { firebase } from "../firebase/firebase";
import Select from "react-select";
import { StyledListItemLink } from "../components/StyledList";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { RecipeContext } from "../context/RecipeContext";
import { Redirect } from "react-router";

function deleteItem(id: string) {
  const db = firebase.firestore();
  db.collection("recipes")
    .doc(id)
    .delete();
}

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

export const ListRecipes = () => {
  const recipes = useContext(RecipeContext);

  const [selectedOption, setOption] = useState({
    label: "Velg",
    value: "0"
  });

  const handleChange = (selectedOption: any) => {
    setOption(selectedOption);
    console.log(`Option selected:`, selectedOption);
  };

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes").onSnapshot(querySnapshot => {
      recipes.setRecipes(
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
      <StyledHeaderH1>Oppskrifter</StyledHeaderH1>
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
          )

          // recipes.map((el: any) => {
          //   return (
          //     <StyledListItemLink key={el.id} to={`/recipes/${el.id}`}>
          //       {el.name}
          //       <div onClick={() => deleteItem(el.id)}>Slett</div>
          //     </StyledListItemLink>
          //   );
          // })
          }
        </RecipeContext.Consumer>
      </ul>
    </>
  );
};
