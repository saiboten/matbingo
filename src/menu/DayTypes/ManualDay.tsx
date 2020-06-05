import React from "react";
import {
  StyledDay,
  StyledDate,
  StyledDayContent,
  ActionButtons,
} from "./styled";
import { format } from "date-fns";
import nbLocale from "date-fns/locale/nb";
import { StyledHeaderH1 } from "../../components/StyledHeaderH1";
import { DeleteDay } from "./DeleteDay";
import { DayData } from "./types";

interface Props {
  today: boolean;
  isShoppingCartActive: boolean;
  addToTrelloActive: boolean;
  date: Date;
  description: string;
  reset: () => void;
  setShowDeleteConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteConfirm: boolean;
  dayData: DayData;
}

export function ManualDay({
  today,
  isShoppingCartActive,
  addToTrelloActive,
  date,
  description,
  reset,
  setShowDeleteConfirmed,
  showDeleteConfirm,
  dayData,
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
        <>
          <div style={{ marginTop: "3.5rem", marginBottom: "2.5rem" }}>
            <StyledHeaderH1>Dagens middagsplan:</StyledHeaderH1>
            <p
              style={{
                textAlign: "left",
                marginBottom: "1rem",
                padding: "0 1rem",
              }}
            >
              {description}
            </p>
            <ActionButtons>
              <DeleteDay
                documentId={dayData.id}
                reset={reset}
                setConfirmed={setShowDeleteConfirmed}
                showConfirm={showDeleteConfirm}
              />
            </ActionButtons>
          </div>
        </>
      </StyledDayContent>
    </StyledDay>
  );
}
