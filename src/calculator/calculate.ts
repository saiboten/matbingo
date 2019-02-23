import { RecipeType } from "../types";
import { differenceInWeeks, getDay } from "date-fns";

const dayToNumber = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

const pointsForDateHit = 100;

const addDateScore = (date: Date, weekDays: any[]) => {
  const todayNumber = getDay(date);
  const todayString = dayToNumber[todayNumber - 1];

  if (!weekDays) {
    return 0;
  }

  return weekDays.includes(todayString) ? pointsForDateHit : 0;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const addRandomScore = (randomSeed: number) => {
  return getRandomInt(randomSeed);
};

const addTimeSinceLastEnjoyedScore = (date: Date, lastTimeSelected: Date) => {
  return differenceInWeeks(date, lastTimeSelected);
};

const addRatingScore = (rating: number) => {
  return rating || 0;
};

export const calculate = (
  date: Date,
  recipe: RecipeType,
  randomSeed: number
) => {
  let sum = 0;

  sum += addDateScore(date, recipe.weekdays);
  sum += addRandomScore(randomSeed);
  sum += addTimeSinceLastEnjoyedScore(date, recipe.lastTimeSelected);
  sum += addRatingScore(recipe.rating);

  return sum;
};
