import styled from "styled-components";
import { minBreakPoint } from "./Constants";

interface Props {
  backgroundColor?: "white";
  narrow?: boolean;
}

export const StyledWrapper = styled.div<Props>`
  max-width: ${(props) => (props.narrow ? 415 : 800)}px;
  margin: 0 auto;
  padding: 15px;
  background-color: ${(props) => props.backgroundColor};

  @media screen and (max-width: ${minBreakPoint}px) {
    margin: 0 auto;
  }
`;

export const StyledWideWrapper = styled<any>(StyledWrapper)`
  position: relative;
  overflow-x: hidden;
  max-width: 815px;
`;
