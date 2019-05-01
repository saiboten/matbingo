import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { primaryColor } from "./Constants";

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
