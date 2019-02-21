import React from "react";
import { format } from "date-fns";
import styled from "styled-components";

interface Props {
  date: Date;
}

const StyledDay = styled.div`
  width: 150px;
  height: 150px;
  border: 1px solid black;
  display: inline-block;
  padding: 10px;
  text-align: center;
  margin: 5px;
`;

export const Day = ({ date }: Props) => (
  <StyledDay>{format(date, "dddd DD.MM.YYYY")}</StyledDay>
);
