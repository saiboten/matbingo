import styled from "styled-components";
import { primaryColor } from "./Constants";

export const StyledActionButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 10px;
  background-color: ${primaryColor};
  color: #fff;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);
`;

export const StyledSecondaryActionButton = styled.button`
  cursor: pointer;
  border: 1px solid ${primaryColor};
  border-radius: 5px;
  padding: 10px;
  background-color: white;
  color: ${primaryColor};
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);
`;

export const StyledActionButtonWithMargins = styled(StyledActionButton)`
  margin: 0 10px;
`;
