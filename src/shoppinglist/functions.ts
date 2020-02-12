import { firebase } from "../firebase/firebase";
import { ShoppingListIngredient } from "../types";

export function updateShoppingListIngredients(shoppingListId: string, ingredients: ShoppingListIngredient[]) {
  const db = firebase.firestore();
  const sorted = sortIngredients(ingredients);
  db.collection("shoppingLists")
    .doc(shoppingListId)
    .set({ ingredients: sorted }, { merge: true });
}

export function compareByName(a: ShoppingListIngredient, b: ShoppingListIngredient) {
  if ( a.ingredientName < b.ingredientName ){
    return -1;
  }
  if ( a.ingredientName > b.ingredientName ){
    return 1;
  }
  return 0;
}

export function sortIngredients(ingredients: ShoppingListIngredient[]) {
  return ingredients.slice().sort(compareByName);
}
