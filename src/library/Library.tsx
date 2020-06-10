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
import { StyledActionButtonForText } from "../components/StyledActionButton";

export function Library() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [feedback, setFeedback] = useState<string | undefined>();

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

  function handleClick(el: RecipeType) {
    const { id, ...rest } = el;

    firebase
      .firestore()
      .collection("recipes")
      .add({
        ...rest,
        copy: true,
        ingredients: [],
        lastTimeSelected: new Date(),
        public: false,
        group: userdata.group,
        image: false,
      });

    setFeedback("Oppskrift lagt til");
    setTimeout(() => setFeedback(undefined), 3000);
  }

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
      {recipes.slice(0, 10).map((el) => {
        return (
          <StyledDay active={false} selected={false}>
            <RecipeDetails recipe={el} showImageUpload={false} />
            <StyledActionButtonForText onClick={() => handleClick(el)}>
              Legg til oppskrift
            </StyledActionButtonForText>
          </StyledDay>
        );
      })}

      {feedback && <div>{feedback}</div>}
    </StyledWrapper>
  );
}
