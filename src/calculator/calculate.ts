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

const pointsForDateHit = 50;

const addDateScore = (date: Date, weekDays: any[]) => {
  const todayNumber = getDay(date);
  const todayString = dayToNumber[todayNumber - 1];

  return weekDays.includes(todayString) ? pointsForDateHit : 0;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const addRandomScore = (randomSeed: number) => {
  return getRandomInt(randomSeed);
};

const addTimeSinceLastEnjoyedScore = (date: Date, lastTimeSelected: Date) => {
  console.log(date, lastTimeSelected);
  return differenceInWeeks(date, lastTimeSelected);
};

const addRatingScore = (rating: number) => {
  return rating;
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
  console.log(sum);
  sum += addRatingScore(recipe.rating);
  console.log(sum);

  console.log(`recipe ${recipe.name} got a score of ${sum}`);

  return sum;
};
