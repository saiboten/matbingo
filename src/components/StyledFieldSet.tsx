import styled from "styled-components";
import { minBreakPoint } from "./Constants";

interface Props {
  wide?: boolean;
}

export const StyledFieldSet = styled.fieldset<Props>`
  position: relative;
  border: none;
  margin-top: 24px;
  margin-bottom: 24px;
  max-width: ${(props) => (props.wide ? 815 : 415)}px;
  margin: 0 auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;
