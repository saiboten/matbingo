import { RecipeType, ScoreDetails } from "../types";
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

const addRatingScore = (rating: number) => (rating ? rating : 0);

export const calculate = (
  date: Date,
  recipe: RecipeType,
  randomSeed: number
) => {
  let score: ScoreDetails = {
    dateScore: 0,
    randomScore: 0,
    timeSinceLastEnjoyed: 0,
    ratingScore: 0,
    totalScore: 0
  };

  score.dateScore = addDateScore(date, recipe.weekdays);
  score.totalScore += score.dateScore;

  score.randomScore = addRandomScore(randomSeed);
  score.totalScore += score.randomScore;

  score.timeSinceLastEnjoyed = addTimeSinceLastEnjoyedScore(
    date,
    recipe.lastTimeSelected
  );
  score.totalScore += score.timeSinceLastEnjoyed;

  score.ratingScore = addRatingScore(recipe.rating);
  score.totalScore += score.ratingScore;

  return score;
};
