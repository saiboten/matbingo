import styled from "styled-components";
import { primaryColor } from "./Constants";

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  border: 1px solid ${primaryColor};
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const StyledButtonWithMargins = styled(StyledButton)`
  margin: 2rem 0;
`;
