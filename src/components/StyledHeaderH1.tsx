import styled from "styled-components";
import { minBreakPoint } from "./Constants";

export const StyledHeaderH1 = styled.h1`
  font-size: 25px;
  margin-top: 24px;
  text-align: center;
  margin-bottom: 24px;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;
