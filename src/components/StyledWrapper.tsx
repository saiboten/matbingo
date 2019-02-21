import styled from "styled-components";
import { minBreakPoint } from "./Constants";

export const StyledWrapper = styled.div`
  max-width: 415px;
  margin: 20px auto;
  border: 1px solid #bbbbbb;
  padding: 15px;
  background-color: #fff;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin: 0 auto;
  }
`;

export const StyledWideWrapper = styled(StyledWrapper)`
  max-width: 815px;
`;
