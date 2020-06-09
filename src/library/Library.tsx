import React, { useState, useEffect, useContext } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { firebase } from "../firebase/firebase";
import { RecipeType } from "../types";
import { RecipeDetails } from "../menu/RecipeDetail";
import { StyledDay } from "../menu/DayTypes/styled";
import { UserDataContext } from "../context/UserDataContext";

import { useLocation, Link } from "react-router-dom";
import { secondaryColor } from "../components/Constants";

export function Library() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);

  const userdata = useContext(UserDataContext).userdata;

  const location = useLocation();

  useEffect(() => {
    const db = firebase.firestore();

    db.collection("recipes")
      .where("public", "==", true)
      .get()
      .then(function (querySnapshot: any) {
        const recipes = querySnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        })) as RecipeType[];

        const recipesWithoutOwn = recipes.filter(
          (el) => el.group !== userdata.group
        );

        setRecipes(recipesWithoutOwn);
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }, [userdata.group]);

  return (
    <StyledWrapper backgroundColor="white">
      {location.search.indexOf("firstVisit") !== -1 && (
        <div
          style={{
            backgroundColor: secondaryColor,
            color: "white",
            padding: "1rem",
          }}
        >
          Velkommen til matbingo! Det første du må gjøre er å velge hvilke
          retter du vil ha i samlingen din. Velg retter under, eller legg til
          dine egne <Link to="/add-recipes">her.</Link>
        </div>
      )}

      <StyledHeaderH1>Inspirasjon</StyledHeaderH1>
      <p>Her kan du legge til nye oppskrifter i samlingen din</p>
      {recipes.map((el) => {
        return (
          <StyledDay active={false} selected={false}>
            <RecipeDetails recipe={el} showImageUpload={false} />
          </StyledDay>
        );
      })}
    </StyledWrapper>
  );
}
