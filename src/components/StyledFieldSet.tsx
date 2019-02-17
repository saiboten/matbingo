import styled from "styled-components";
import { minBreakPoint } from "./Constants";

export const StyledFieldSet = styled.fieldset`
  position: relative;
  border: none;
  margin-top: 24px;
  margin-bottom: 24px;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;
