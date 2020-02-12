import React, { ReactElement, useContext, useCallback } from 'react'
import 'styled-components/macro'
import AddShoppingCartSharpIcon from '@material-ui/icons/AddShoppingCartSharp';
import DoneSharpIcon from '@material-ui/icons/DoneSharp';

import { ShoppingListContext } from '../context/ShoppingListContext';
import { StyledActionButton } from '../components/StyledActionButton';
import { RecipeContext } from '../context/RecipeContext';
import { Ingredient, RecipeType, ShoppingListIngredient } from '../types';
import { IngredientsContext } from '../context/IngredientsContext';
import { updateShoppingListIngredients, sortIngredients } from '../shoppinglist/functions';

interface Props {
  isInBasket: boolean;
  setIsInBasket: () => void;
}
function ToggleShoppingCartComponent({ isInBasket, setIsInBasket }: Props): ReactElement {
  return (
    <StyledActionButton onClick={setIsInBasket} css="margin-right: 6px">
      { isInBasket ?
        <DoneSharpIcon fontSize="large" /> :
        <AddShoppingCartSharpIcon fontSize="large" />
      }
    </StyledActionButton>
  )
}

function makeId(length: number) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function mapToShoppingListIngredients(recipeId: string, recipes: RecipeType[], ingredients: Ingredient[]): ShoppingListIngredient[] {
  const recipe = recipes.find(x => x.id === recipeId);
  if (!recipe) {
    return [];
  }
  const ingredientsIds = recipe.ingredients;
  const newIngredients = ingredients
    .filter(x => ingredientsIds.includes(x.id))
    .map(x => ({
      id: makeId(20),
      ingredientId: x.id,
      ingredientName: x.name,
      checked: false,
      recipeId: recipe.id,
      recipeName: recipe.name
    }));
  return newIngredients;
}

interface WrapperProps {
  recipeId: string;
}
function ToggleShoppingCart({ recipeId }: WrapperProps): ReactElement {
  const context = useContext(ShoppingListContext);
  
  const shoppingListIngredients = context.ingredients;
  const setShoppingListIngredients = context.setIngredients;
  const shoppingListId = context.id;

  const recipes = useContext(RecipeContext).recipes;
  const { ingredients } = useContext(IngredientsContext);

  const isInBasket = (shoppingListIngredients.filter(x => x.recipeId === recipeId)?.length ?? 0) > 0;

  const addToShoppingList = useCallback(
    () => {
      if (ingredients.length === 0) {
        return;
      }
      let newIngredients: ShoppingListIngredient[] = [];
      if (isInBasket) {
        newIngredients = shoppingListIngredients.filter(x => x.recipeId !== recipeId).map(x => ({...x}));
      }
      else {
        const ingredientsToAdd = mapToShoppingListIngredients(recipeId, recipes, ingredients);
        newIngredients = shoppingListIngredients.concat(ingredientsToAdd);
      }
 
      setShoppingListIngredients(sortIngredients(newIngredients));
      if(shoppingListId && newIngredients) {
        updateShoppingListIngredients(shoppingListId, newIngredients);
      }
    },
    [ingredients, isInBasket, recipeId, recipes, setShoppingListIngredients, shoppingListId, shoppingListIngredients],
  )

  return (
    <ToggleShoppingCartComponent
      isInBasket={isInBasket}
      setIsInBasket={addToShoppingList}
    />)
}

export { ToggleShoppingCart };
