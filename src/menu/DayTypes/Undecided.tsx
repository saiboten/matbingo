import React from "react";
import { StyledDay, StyledDate, StyledDayContent } from "./styled";
import { format } from "date-fns";
import nbLocale from "date-fns/locale/nb";
import { GenerateDay } from "../GenerateDay";
import { Filter } from "../Filter";

interface Props {
  today: boolean;
  isShoppingCartActive: boolean;
  addToTrelloActive: boolean;
  date: Date;
  activeFilters: Filter[];
}

export function Undecided({
  today,
  isShoppingCartActive,
  addToTrelloActive,
  activeFilters,
  date,
}: Props) {
  return (
    <StyledDay
      active={today}
      selected={isShoppingCartActive && addToTrelloActive}
    >
      <StyledDate>
        {format(date, "dddd DD.MM", { locale: nbLocale })}
      </StyledDate>
      <StyledDayContent>
        <GenerateDay date={date} activeFilters={activeFilters} />
      </StyledDayContent>
    </StyledDay>
  );
}
