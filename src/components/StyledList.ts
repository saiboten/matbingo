import styled from "styled-components";

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
