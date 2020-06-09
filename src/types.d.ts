export type Unit = "Liter" | "Units" | "Kg" | "Cups";

export interface Ingredient {
  name: string;
  unit: Unit;
  id: string;
}

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type RatingType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CourseType = "fish" | "meat" | "vegetarian" | "other" | undefined;

export interface ScoreDetails {
  dateScore: number;
  randomScore: number;
  frequencyScore: number;
  neverEatenScore: number;
  totalScore: number;
}

export interface RecipeWithRatingType extends RecipeType {
  score: ScoreDetails;
}

export interface RecipeType {
  name: string;
  description: string;
  id: string;
  ingredients: string[];
  weekdays: WeekDay[];
  lastTimeSelected: Date;
  rating: RatingType;
  hasBeenSelected: boolean;
  recipetype: CourseType[];
  image: boolean | undefined;
  group?: string;
}

export type RecipeDict = { [id: string]: RecipeType };

export interface ShoppingListIngredient {
  id: string;
  ingredientId: string;
  ingredientName: string;
  checked: boolean;
  recipeId: string;
  recipeName: string;
}

export interface ShoppingListType {
  id: string;
  group: string;
  ingredients: ShoppingListIngredient[];
}

export interface WunderlistList {
  id: number;
  title: string;
}

declare module "react" {
  interface Attributes {
    css?: InterpolationWithTheme<any>;
  }
}
