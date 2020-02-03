import styled from "styled-components";
import { minBreakPoint } from "./Constants";

interface Props {
  backgroundColor?: "white";
}

export const StyledWrapper = styled.div<Props>`
  max-width: 415px;
  margin: 0 auto;
  padding: 15px;
  background-color: ${props => props.backgroundColor};

  @media screen and (max-width: ${minBreakPoint}px) {
    margin: 0 auto;
  }
`;

export const StyledWideWrapper = styled<any>(StyledWrapper)`
  max-width: 815px;
`;
