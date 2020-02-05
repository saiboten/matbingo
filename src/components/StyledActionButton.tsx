import styled from "styled-components";
import { primaryColor, secondaryColor } from "./Constants";

export const StyledActionButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 10px;
  background-color: ${secondaryColor};
  color: #fff;
  padding: 5px;
  padding-bottom: 2px;
  border-radius: 5px;
`;

export const StyledActionButtonForText = styled.button`
  cursor: pointer;
  border: none;
  background-color: ${secondaryColor};
  color: #fff;
  padding: 10px;
  border-radius: 5px;
`;

export const StyledSecondaryActionButtonForText = styled(
  StyledActionButtonForText
)`
  color: black;
  border: 1px solid ${primaryColor};
  background-color: white;
`;

export const StyledSecondaryActionButton = styled.button`
  cursor: pointer;
  border: 1px solid ${primaryColor};
  border-radius: 5px;
  padding: 10px;
  background-color: white;
  color: ${secondaryColor};
`;

export const StyledActionButtonWithMargins = styled(StyledActionButton)`
  margin: 10px;
  padding: 5px;
  padding-bottom: 2px;
  border-radius: 5px;
`;

export const StyledSecondaryActionButtonWithMargins = styled(
  StyledSecondaryActionButton
)`
  margin: 10px;
  padding: 5px;
  padding-bottom: 2px;
  border-radius: 5px;
`;
