import styled from "styled-components";
import { Link } from "react-router-dom";
import { primaryColor, secondaryColor } from "./Constants";

export const StyledLink = styled(Link)`
  &:visited,
  &:link {
    color: black;
    text-decoration: none;
  }
  padding: 1rem;
  margin: 1rem;
  border-bottom: 1px solid ${primaryColor};
  display: inline-block;
`;

export const StyledButtonLink = styled(Link)`
  cursor: pointer;
  border: none;
  padding: 10px;
  background-color: ${secondaryColor};
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:visited,
  &:link {
    color: black;
    text-decoration: none;
  }
`;
