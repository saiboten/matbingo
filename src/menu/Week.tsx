import React, { useState, useContext } from "react";
import { Day } from "./Day";
import { startOfWeek, getISOWeek, addDays, subWeeks, addWeeks } from "date-fns";
import styled from "styled-components";
import {
  StyledActionButtonWithMargins,
  StyledActionButton
} from "../components/StyledActionButton";
import { StyledWideWrapper } from "../components/StyledWrapper";
import { start } from "repl";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledNotification } from "../components/StyledNotification";
import { StyledNext, StyledPrevious } from "../components/StyledSvgIcons";
import { UserDataContext, UserData } from "../context/UserDataContext";
import { Ingredient, RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { RecipeContext } from "../context/RecipeContext";
import { IngredientsContext } from "../context/IngredientsContext";

const StyledDayList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface CreateCardResponse {
  id: string;
}
interface CreateChecklistResponse {
  id: string;
}

const addIngredients = (
  ingredients: string[],
  userdata: UserData,
  checklistId: string
) => {
  ingredients.forEach(ingredient => {
    fetch(
      `https://api.trello.com/1/checklists/${checklistId}/checkItems?key=${
        userdata.trelloApiKey
      }&token=${userdata.trelloApiToken}&name=${ingredient}`,
      {
        method: "POST"
      }
    );
  });
};

const addChecklist = (
  ingredients: string[],
  userdata: UserData,
  id: string
) => {
  fetch(
    `https://api.trello.com/1/checklists/?key=${userdata.trelloApiKey}&token=${
      userdata.trelloApiToken
    }&idCard=${id}`,
    {
      method: "POST"
    }
  )
    .then(data => data.json())
    .then((data: CreateChecklistResponse) => {
      addIngredients(ingredients, userdata, data.id);
    });
};

const addCard = (ingredients: string[], userdata: UserData) => {
  fetch(
    `https://api.trello.com/1/cards?name=Handleliste&pos=top&idList=${
      userdata.trelloList
    }&key=${userdata.trelloApiKey}&token=${userdata.trelloApiToken}`,
    {
      method: "POST"
    }
  )
    .then((data: any) => data.json())
    .then((data: CreateCardResponse) => {
      addChecklist(ingredients, userdata, data.id);
    });
};

const addWeekToTrello = (
  ingredients: Ingredient[],
  recipes: RecipeType[],
  listOfDays: Date[],
  userdata: UserData
) => {
  const db = firebase.firestore();
  const promiseList: any = [];
  listOfDays.forEach((day: any) => {
    promiseList.push(
      db
        .collection("days")
        .where("date", "==", day)
        .get()
    );
  });

  Promise.all(promiseList).then(data => {
    const res = data.reduce((init: any, next: any) => {
      init.push(next.docs[0].data());
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

    addCard(ingredientsThisWeek, userdata);
  });
};

export const Week = () => {
  const userdata = useContext(UserDataContext).userdata;
  const recipes = useContext(RecipeContext).recipes;
  const ingredients = useContext(IngredientsContext).ingredients;
  const [selectedDay, setSelectedDay] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const listOfDays = new Array(7)
    .fill("")
    .map((el: any, index: number) => addDays(selectedDay, index));

  return (
    <StyledWideWrapper>
      <StyledActionButton
        onClick={() =>
          addWeekToTrello(ingredients, recipes, listOfDays, userdata)
        }
      >
        Generer
      </StyledActionButton>

      <StyledHeaderH1>Ukesmeny uke {getISOWeek(selectedDay)} </StyledHeaderH1>
      <StyledButtonGroup>
        <StyledActionButtonWithMargins
          onClick={() => setSelectedDay(subWeeks(selectedDay, 1))}
        >
          <StyledPrevious />
        </StyledActionButtonWithMargins>
        <StyledActionButtonWithMargins
          onClick={() => setSelectedDay(addWeeks(selectedDay, 1))}
        >
          <StyledNext />
        </StyledActionButtonWithMargins>
      </StyledButtonGroup>
      <StyledDayList>
        {listOfDays.map((el: any) => (
          <Day key={el} date={el} />
        ))}
      </StyledDayList>
    </StyledWideWrapper>
  );
};
