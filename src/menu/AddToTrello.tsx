import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { UserDataContext } from "../context/UserDataContext";
import { RecipeContext } from "../context/RecipeContext";
import { IngredientsContext } from "../context/IngredientsContext";
import { Ingredient, RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { GroupDataContext } from "../context/GroupDataContext";
import { StyledButton } from "../components/StyledButton";

interface CreateCardResponse {
  id: string;
}
interface CreateChecklistResponse {
  id: string;
}

const Wrapper = styled.div`
  background-color: #fff;
  padding: 1rem;
  border-radius: 5px;
`;

export const AddToTrello = ({
  listOfDays,
  doneCallback
}: {
  listOfDays: Date[];
  doneCallback: () => void;
}) => {
  const [loading, setLoading]: [boolean, any] = useState(false);
  const [done, setDone]: [boolean, any] = useState(false);

  const userData = useContext(UserDataContext).userdata;
  const groupData = useContext(GroupDataContext).groupData;
  const recipes = useContext(RecipeContext).recipes;
  const ingredients = useContext(IngredientsContext).ingredients;

  useEffect(
    () => {
      setLoading(false);
      setDone(false);
    },
    [listOfDays]
  );

  const addIngredients = async (ingredients: string[], checklistId: string) => {
    for (let i = 0; i < ingredients.length; i++) {
      await fetch(
        `https://api.trello.com/1/checklists/${checklistId}/checkItems?key=${
          groupData.trelloApiKey
        }&token=${groupData.trelloApiToken}&name=${ingredients[i]}`,
        {
          method: "POST"
        }
      );
    }
    setLoading(false);
    setDone(true);
    doneCallback();
  };

  const addChecklist = (ingredients: string[], id: string) => {
    fetch(
      `https://api.trello.com/1/checklists/?key=${
        groupData.trelloApiKey
      }&token=${groupData.trelloApiToken}&idCard=${id}`,
      {
        method: "POST"
      }
    )
      .then(data => data.json())
      .then((data: CreateChecklistResponse) => {
        addIngredients(ingredients, data.id);
      });
  };

  const addCard = (ingredients: string[]) => {
    fetch(
      `https://api.trello.com/1/cards?name=Handleliste&pos=top&idList=${
        groupData.trelloList
      }&key=${groupData.trelloApiKey}&token=${groupData.trelloApiToken}`,
      {
        method: "POST"
      }
    )
      .then((data: any) => data.json())
      .then((data: CreateCardResponse) => {
        addChecklist(ingredients, data.id);
      });
  };

  const addWeekToTrello = (listOfDays: Date[]) => {
    setLoading(true);
    const db = firebase.firestore();
    const promiseList: any = [];
    listOfDays.forEach((day: any) => {
      promiseList.push(
        db
          .collection("days")
          .where("group", "==", userData.group)
          .where("date", "==", day)
          .get()
      );
    });

    Promise.all(promiseList).then(data => {
      const res = data.reduce((init: any, next: any) => {
        if (next.docs[0] && next.docs[0].exists) {
          init.push(next.docs[0].data());
        }
        return init;
      }, []);
      const recipeIds = res
        .filter((el: any) => el.recipe)
        .map((el: any) => el.recipe);
      const recipesThisWeek: RecipeType[] = recipeIds.map((recipeId: string) =>
        recipes.find(el => el.id === recipeId)
      );

      const ingredientsThisWeek = recipesThisWeek
        .reduce((init: any, recipe: RecipeType) => {
          const ingredientsOnThisRecipe = recipe.ingredients.map(ingredientId =>
            ingredients.find(el => el.id === ingredientId)
          );

          return init.concat(ingredientsOnThisRecipe);
        }, [])
        .map((ingredient: Ingredient) => ingredient.name);

      addCard(ingredientsThisWeek);
    });
  };

  if (loading) {
    return <StyledLocalLoader />;
  }

  if (groupData.trelloApiToken === "") {
    return <div />;
  }

  if (listOfDays.length === 0) {
    return <Wrapper>Du må velge noen dager å generere for</Wrapper>;
  }

  if (done) {
    return <Wrapper>Handleliste generert</Wrapper>;
  }

  return (
    <Wrapper
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <div>Antall dager valgt: {listOfDays.length}</div>
      <StyledButton onClick={() => addWeekToTrello(listOfDays)}>
        Generer handleliste
      </StyledButton>
    </Wrapper>
  );
};
