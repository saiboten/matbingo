import React, { ReactElement } from 'react'
import { Transition } from 'react-transition-group';

import { HighlightOff } from "@material-ui/icons";

const duration = 200;

const defaultStyle = {
  transition: `margin-right ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
  marginRight: 0
}

const transitionStyles: any = {
  entering: { marginRight: 0.01, opacity: 0 },
  entered: { marginRight: 6, opacity: 1 },
  exiting: { marginRight: 6, opacity: 1 },
  exited: { marginRight: 0.01, opacity: 0 },
};

interface Props {
  isVisible: boolean;
  deleteIngredient: () => void;
}
export function IngredientActions({ isVisible, deleteIngredient }: Props): ReactElement | null {
  return (
    <Transition in={isVisible} timeout={duration} mountOnEnter>
      { state => (
        <div style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }} >
          <HighlightOff fontSize="large" color="action" onClick={deleteIngredient} />
        </div>
      )}

    </Transition>
  )
}
