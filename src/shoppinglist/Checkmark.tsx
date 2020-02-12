import React, { ReactElement } from 'react'
import styled from 'styled-components';

import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const Wrapper = styled.div`
  margin-right: 1rem;
`;
interface Props {
  isChecked: boolean;
}
export function Checkmark({ isChecked }: Props): ReactElement {
  return (
    <Wrapper>
      {isChecked ? <CheckCircleOutlineIcon fontSize="large" color="action" /> : <RadioButtonUncheckedIcon fontSize="large" color="action" />}
    </Wrapper>
  )
}
