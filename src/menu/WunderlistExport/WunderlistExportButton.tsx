import React, { ReactElement } from 'react'
import styled from 'styled-components';
import {
  StyledActionButtonForText
} from "../../components/StyledActionButton";

interface Props {
  onClick: () => void
}

const Button = styled(StyledActionButtonForText)`
  margin-left: 12px;
`;

export function WunderlistExportButton({ onClick }: Props): ReactElement<Props> {
  return (
    <Button onClick={onClick}>Lag handleliste v2</Button>
  )
}
