import { RecipeType } from "../types";
import { differenceInWeeks, getDay } from "date-fns";
import { WeekDay } from "../types";

const dayToNumber = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

const addDateScore = (date: Date, weekDays: any[]) => {
  const todayNumber = getDay(date);
  console.log(todayNumber);
  const todayString = dayToNumber[todayNumber - 1];

  return weekDays.includes(todayString) ? 5 : 0;
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const addRandomScore = (randomSeed: number) => {
  return getRandomInt(randomSeed);
};

const addTimeSinceLastEnjoyed = (date: Date, lastTimeSelected: Date) => {
  return differenceInWeeks(date, lastTimeSelected);
};

export const calculate = (
  date: Date,
  recipe: RecipeType,
  randomSeed: number
) => {
  let sum = 0;

  sum += addDateScore(date, recipe.weekdays);
  sum += addRandomScore(randomSeed);
  sum += addTimeSinceLastEnjoyed(date, recipe.lastTimeSelected);

  return sum;
};
