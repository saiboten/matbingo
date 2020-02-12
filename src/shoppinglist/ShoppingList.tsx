import React, { ReactElement, useContext, useCallback } from 'react'
import produce from 'immer';
import styled from 'styled-components';
import { minBreakPoint } from "../components/Constants";
import { StyledWrapper } from "../components/StyledWrapper";
import { ShoppingListContext } from '../context/ShoppingListContext';
import { ShoppingListIngredientComponent } from './ShoppingListIngredientComponent';
import { updateShoppingListIngredients } from './functions';

const Wrapper = styled(StyledWrapper)`
  @media screen and (max-width: ${minBreakPoint}px) {
    margin: 0 auto;
    padding-top: 5rem;
    padding-left: 2rem;
    height: 100vh;
  }
`;
function ShoppingList(): ReactElement | null {
  const { ingredients, id, setIngredients } = useContext(ShoppingListContext);
  const toggleChecked = useCallback(
    (ingredientId: string) => {
      const nextIngredients = produce(ingredients, draftIngredients => {
        if (!draftIngredients) {
          return;
        }
        const indexOfIngredient = draftIngredients.findIndex(x => x.id === ingredientId) ?? 0;
        
        const newIngredient = draftIngredients[indexOfIngredient];
        
        draftIngredients[indexOfIngredient] = { ...newIngredient, checked: !newIngredient?.checked };
      });
      setIngredients(nextIngredients);
      if (id && nextIngredients) {
        updateShoppingListIngredients(id, nextIngredients);
      }
    },
    [id, ingredients, setIngredients],
  )

  const deleteIngredient = useCallback(
    (ingredientId: string) => {
      const newIngredients = ingredients
        .filter(x => x.id !== ingredientId)
        .map(x => ({...x}));

      setIngredients(newIngredients);
      if (id) {
        updateShoppingListIngredients(id, newIngredients);
      }
    },
    [id, ingredients, setIngredients],
  )
  if (ingredients.length === 0) {
    return null;
  }

  const ingredientsEl = ingredients.map(x =>
    <ShoppingListIngredientComponent
      key={x.id}
      ingredient={x}
      toggleChecked={toggleChecked}
      deleteIngredient={deleteIngredient}
    />);

  return (
    <Wrapper backgroundColor="white" >
      {ingredientsEl}
    </Wrapper>
  );
}

export { ShoppingList };
