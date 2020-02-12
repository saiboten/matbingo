import React, { ReactElement } from 'react'
import styled from 'styled-components';
import { Transition } from 'react-transition-group'
import { Typography } from '@material-ui/core';


const Wrapper = styled.div`

`;

const SubTitle = styled.div`
  display: block;
  overflow-y: hidden;
  text-transform: uppercase;
`;

const duration = 100;

const defaultStyle = {
  transition: `height ${duration}ms ease-in-out`,
  height: 0
}

const transitionStyles: any = {
  entering: { height: 0.01 },
  entered: { height: 14 },
  exiting: { height: 14 },
  exited: { height: 0.01 },
};

interface Props {
  name: string;
  recipeName?: string;
  showRecipeName: boolean;
}
export function ShoppingListIngredientTitle({ name, recipeName, showRecipeName }: Props): ReactElement {
  const displayRecipeName = Boolean(recipeName && showRecipeName);
  return (
  <Wrapper>
    <Typography variant="h5">{name}</Typography>
    <Transition in={displayRecipeName} timeout={duration}>
      { state => (
        <SubTitle
        style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}
        >
          <Typography variant="subtitle1" color="textSecondary">{recipeName}</Typography>
        </SubTitle>
      )
      }
    </Transition>
  </Wrapper>
  )
}
