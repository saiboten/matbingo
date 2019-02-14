import styled from "styled-components";
import { Link } from "react-router-dom";

export const StyledList = styled.ul``;

export const StyledListItem = styled.li`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid grey;

  &:first-child {
    border-top: 1px solid grey;
  }
`;

export const StyledListItemLink = styled(Link)`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid grey;

  &:visited,
  &:link {
    text-decoration: none;
    color: inherit;
  }

  &:first-child {
    border-top: 1px solid grey;
  }
`;
