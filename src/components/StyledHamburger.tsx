import React from "react";
import styled from "styled-components";
import { primaryColor, minBreakPoint } from "./Constants";

export const StyledLines = styled.div`
  width: 20px;
  height: 3px;
  background-color: ${primaryColor};
  position: absolute;
  top: 10px;
  border-radius: 2px;

  &::after {
    content: "";
    width: 20px;
    height: 3px;
    position: absolute;
    top: 8px;
    background-color: ${primaryColor};
    border-radius: 2px;
  }

  &::before {
    content: "";
    width: 20px;
    height: 3px;
    position: absolute;
    top: 16px;
    background-color: ${primaryColor};
    border-radius: 2px;
  }
`;

export const StyledWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  cursor: pointer;
  border: 1px solid black;
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  border-radius: 10px;

  @media screen and (min-width: ${minBreakPoint}px) {
    display: none;
  }
`;

export const StyledHamburger = ({ onClick }: any) => (
  <StyledWrapper onClick={onClick}>
    <StyledLines />
  </StyledWrapper>
);
