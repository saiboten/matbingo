import React, { useContext, useState, useEffect } from "react";
import { StyledActionButton } from "../components/StyledActionButton";
import { UserDataContext } from "../context/UserDataContext";
import { RecipeContext } from "../context/RecipeContext";
import { IngredientsContext } from "../context/IngredientsContext";
import { Ingredient, RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledLocalLoader } from "../components/StyledLocalLoader";

interface CreateCardResponse {
  id: string;
}
interface CreateChecklistResponse {
  id: string;
}

export const AddToTrello = ({ listOfDays }: { listOfDays: Date[] }) => {
  const [loading, setLoading]: [boolean, any] = useState(false);
  const [done, setDone]: [boolean, any] = useState(false);

  const userdata = useContext(UserDataContext).userdata;
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
          userdata.trelloApiKey
        }&token=${userdata.trelloApiToken}&name=${ingredients[i]}`,
        {
          method: "POST"
        }
      );
    }
    setLoading(false);
    setDone(true);
  };

  const addChecklist = (ingredients: string[], id: string) => {
    fetch(
      `https://api.trello.com/1/checklists/?key=${
        userdata.trelloApiKey
      }&token=${userdata.trelloApiToken}&idCard=${id}`,
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
        userdata.trelloList
      }&key=${userdata.trelloApiKey}&token=${userdata.trelloApiToken}`,
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

      addCard(ingredientsThisWeek);
    });
  };

  if (loading) {
    return <StyledLocalLoader />;
  }

  if (done) {
    return <div>Handleliste generert</div>;
  }

  return (
    <StyledActionButton onClick={() => addWeekToTrello(listOfDays)}>
      Generer handleliste
    </StyledActionButton>
  );
};
