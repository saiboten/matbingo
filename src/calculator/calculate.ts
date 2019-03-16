import { RecipeType, ScoreDetails } from "../types";
import { differenceInWeeks, getDay } from "date-fns";

const dayToNumber = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const pointsForDateHit = 100;

const addDateScore = (date: Date, weekDays: any[]) => {
  const todayNumber = getDay(date);
  const todayString = dayToNumber[todayNumber];

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

const addFrequencyScore = (timeSinceEnjoyedScore: number, frequency: number) =>
  frequency * timeSinceEnjoyedScore;

const addNeverEatenScore = (hasBeenEaten: boolean | undefined) =>
  hasBeenEaten ? 0 : 1000;

export const calculate = (
  date: Date,
  recipe: RecipeType,
  randomSeed: number
) => {
  let score: ScoreDetails = {
    dateScore: 0,
    randomScore: 0,
    frequencyScore: 0,
    totalScore: 0,
    neverEatenScore: 0
  };

  score.dateScore = addDateScore(date, recipe.weekdays);
  score.totalScore += score.dateScore;

  score.randomScore = addRandomScore(randomSeed);
  score.totalScore += score.randomScore;

  const timeSinceLastEnjoyed = addTimeSinceLastEnjoyedScore(
    date,
    recipe.lastTimeSelected
  );

  score.frequencyScore = addFrequencyScore(timeSinceLastEnjoyed, recipe.rating);
  score.totalScore += score.frequencyScore;

  score.neverEatenScore = addNeverEatenScore(recipe.hasBeenSelected);
  score.totalScore += score.neverEatenScore;

  return score;
};
