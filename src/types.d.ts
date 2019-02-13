export enum Unit {
  Liter = 1,
  Units,
  Kg,
  Cups
}

export interface Ingredient {
  name: string;
  unit: Unit;
}

export interface RecipeType {
  name: string;
  description: string;
  id: string;
}
