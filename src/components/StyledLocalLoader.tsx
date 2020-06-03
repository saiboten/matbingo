import React from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as Spinner } from "./svg/Loading.svg";
import { secondaryColor } from "./Constants";

const rotate = keyframes`
	0% {
        transform: rotate(0deg) scale(0.8);
    }
    50% {
        transform: rotate(180deg) scale(1.2);
    }
    100% {
        transform: rotate(359deg) scale(0.8);
    }
`;

export const StyledLocalLoader = styled(Spinner)`
  animation: ${rotate} 1s infinite linear;
  fill: ${secondaryColor};
`;

export function StyledLocalLoaderCentered() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StyledLocalLoader />
    </div>
  );
}
