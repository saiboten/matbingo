import * as React from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Chef } from "./chef.svg";
import { ReactComponent as Flower } from "./flower.svg";

const upanddown = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5%) rotateY(50deg);
  }
  100% {
    transform: translateY(0);
  }
`;

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const ChefWrapper = styled(Chef)`
    width: 200px;
    max-width: 100vw;
    animation: ${upanddown} 2s infinite ease-in-out;
`;

const FlowerWrapper = styled(Flower)`
    width: 30px;
    animation: ${upanddown} 3s infinite ease-in-out;
`;

export const StyledLoader = () => (
  <StyledWrapper>
    <ChefWrapper />
    <FlowerWrapper />
  </StyledWrapper>
);
