import styled from "styled-components";
import { minBreakPoint } from "./Constants";

export const StyledHeaderH1 = styled.h1`
  font-size: 25px;
  margin-top: 24px;
  text-align: center;
  margin-bottom: 24px;
  align-self: center;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;

export const StyledAlternateHeaderH1 = styled(StyledHeaderH1)`
  color: #fff;
`;

export const StyledHeaderH1NoMarginTop = styled(StyledHeaderH1)`
  margin-top: 0 !important;
`;

export const StyledHeaderH2 = styled.h1`
  font-size: 18px;
  margin-top: 24px;
  text-align: center;
  margin-bottom: 24px;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;
