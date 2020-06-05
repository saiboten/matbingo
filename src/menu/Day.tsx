import React, { useEffect, useState, useContext } from "react";
import { isToday } from "date-fns";
import { firebase } from "../firebase/firebase";
import { UserDataContext } from "../context/UserDataContext";
import { Filter } from "./Filter";
import { useSingleRecipe } from "../hooks/useRecipes";
import { RecipeSelected } from "./DayTypes/RecipeSelected";
import { ManualDay } from "./DayTypes/ManualDay";
import { Undecided } from "./DayTypes/Undecided";
import { DayData } from "./DayTypes/types";

interface Props {
  date: Date;
  addToTrelloActive: boolean;
  toggleShoppingCart: (date: Date) => void;
  isShoppingCartActive: boolean;
  activeFilters: Filter[];
}

// const initialState: RecipeType = {
//   name: "",
//   description: "",
//   id: "",
//   ingredients: [],
//   weekdays: [],
//   lastTimeSelected: new Date(),
//   rating: 1,
//   hasBeenSelected: false,
//   recipetype: []
// };

const initialDayData: DayData = {
  id: "",
  date: new Date(),
  group: "",
  recipe: undefined,
  description: undefined,
};

export const Day = ({
  date,
  addToTrelloActive,
  toggleShoppingCart,
  isShoppingCartActive,
  activeFilters,
}: Props) => {
  const [dayData, setDayData]: [DayData, any] = useState(initialDayData);
  const [loading, setLoading]: any = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirmed] = useState(false);

  const userdata = useContext(UserDataContext).userdata;

  const reset = () => {
    setDayData(initialDayData);
    setShowDeleteConfirmed(false);
  };

  const [recipeLoading, recipe] = useSingleRecipe(dayData.recipe);

  useEffect(() => {
    reset();
    const db = firebase.firestore();
    const daysQuery = db
      .collection("days")
      .where("date", "==", date)
      .where("group", "==", userdata.group);
    const unsub = daysQuery.onSnapshot((daysMatchesDoc) => {
      if (daysMatchesDoc.empty) {
        setLoading(false);
      }

      daysMatchesDoc.forEach((daysMatch) => {
        const dayData: any = daysMatch.data();
        setLoading(false);
        setDayData({
          id: daysMatch.id,
          ...dayData,
        });
      });
    });
    return () => {
      unsub();
    };
  }, [date, userdata.group]);

  const today = isToday(date);

  if (recipeLoading || loading) {
    return null;
  }

  if (dayData.description) {
    return (
      <ManualDay
        today={today}
        isShoppingCartActive={isShoppingCartActive}
        addToTrelloActive={addToTrelloActive}
        date={date}
        description={dayData.description}
        reset={reset}
        setShowDeleteConfirmed={setShowDeleteConfirmed}
        dayData={dayData}
        showDeleteConfirm={showDeleteConfirm}
      />
    );
  }

  if (recipe?.name !== undefined) {
    return (
      <RecipeSelected
        today={today}
        isShoppingCartActive={isShoppingCartActive}
        addToTrelloActive={addToTrelloActive}
        date={date}
        dayData={dayData}
        showDeleteConfirm={showDeleteConfirm}
        reset={reset}
        setShowDeleteConfirmed={setShowDeleteConfirmed}
        toggleShoppingCart={toggleShoppingCart}
        recipe={recipe}
      />
    );
  }

  return (
    <Undecided
      today={today}
      isShoppingCartActive={isShoppingCartActive}
      addToTrelloActive={addToTrelloActive}
      date={date}
      activeFilters={activeFilters}
    />
  );
};
