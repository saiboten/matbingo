import React from "react";
import styled from "styled-components";
import { primaryColor, minBreakPoint } from "./Constants";

interface Props {
  active: boolean;
}

export const StyledLines = styled.div<Props>`
  width: 20px;
  background-color: ${primaryColor};
  position: absolute;
  top: 10px;
  border-radius: 2px;
  height: ${props => (props.active ? "0" : "3px")};

  &::after {
    transition: transform 0.5s;
    content: "";
    width: 20px;
    height: 3px;
    position: absolute;
    top: 8px;
    background-color: ${primaryColor};
    border-radius: 2px;
    transform: rotate(${props => (props.active ? "45" : "0")}deg);
  }

  &::before {
    transition: transform 0.5s;
    content: "";
    width: 20px;
    height: 3px;
    position: absolute;
    top: ${props => (props.active ? "8px" : "16px")};
    background-color: ${primaryColor};
    border-radius: 2px;
    transform: rotate(${props => (props.active ? "-45" : "0")}deg);
  }
`;

export const StyledWrapper = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
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

interface HamburgerProps {
  onClick: () => void;
  active: boolean;
}

export const StyledHamburger = ({ onClick, active }: HamburgerProps) => (
  <StyledWrapper onClick={onClick}>
    <StyledLines active={active} />
  </StyledWrapper>
);
