import React, { ReactElement, useCallback, useState, ReactNode } from 'react'
import styled from 'styled-components';
import 'styled-components/macro'

import { ShoppingListIngredient } from "../types";
import { Checkmark } from "./Checkmark";
import { ShoppingListIngredientTitle } from './ShoppingListIngredientTitle';
import { IngredientActions } from './IngredientActions';


const StyledWrapper = styled.div<{ checked: boolean }>`
  position: relative;
  display: float;
  justify-content: space-between;
  padding: 10px 0;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  ${props => props.checked && `color: grey;`}
`;

const Throughline = styled.div`
  position: absolute;
  width: 80%;
  border-bottom: 1px solid gray;
  border-radius: 50%;
`;

interface WrapperProps {
  checked: boolean;
  children: ReactNode;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}
function Wrapper({ checked, children, onMouseEnter, onMouseLeave }: WrapperProps): ReactElement {
  return (
  <StyledWrapper checked={checked} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
    {checked && <Throughline />}
  </StyledWrapper>)
}

const LeftSectionWrapper = styled.div`
  height: 50px;
  display: float;
  align-items: center;
`;

interface Props {
  ingredient: ShoppingListIngredient;
  toggleChecked: (ingredientId: string) => void;
  deleteIngredient: (shoppingListIngredientId: string) => void;
}
export function ShoppingListIngredientComponent({ ingredient, toggleChecked, deleteIngredient }: Props): ReactElement {
  const [isActive, setIsActive] = useState(false);
  
  const memoizedToggleChecked = useCallback(
    () => {
      toggleChecked(ingredient.id);
    },
    [ingredient.id, toggleChecked],
  )

  const memoizedDeleteIngredient = useCallback(
    () => {
      deleteIngredient(ingredient.id);
    },
    [ingredient.id, deleteIngredient],
  )
  
  return (
    <Wrapper
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      checked={ingredient.checked}
    >
      <LeftSectionWrapper onClick={memoizedToggleChecked}>
        <Checkmark isChecked={ingredient.checked} />
        <ShoppingListIngredientTitle
          name={ingredient.ingredientName}
          recipeName={ingredient.recipeName}
          showRecipeName={isActive}
        />
      </LeftSectionWrapper>
 
      <IngredientActions
        isVisible={isActive}
        deleteIngredient={memoizedDeleteIngredient}
      />
    </Wrapper>
  )
}

