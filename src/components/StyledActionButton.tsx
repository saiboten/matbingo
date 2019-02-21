import styled from "styled-components";
import { primaryColor } from "./Constants";

export const StyledActionButton = styled.button`
  cursor: pointer;
  border: none;
  padding: 10px;
  background-color: ${primaryColor};
  color: #fff;
`;

export const StyledActionButtonWithMargins = styled(StyledActionButton)`
  margin: 0 10px;
`;
