import React, { useState } from "react";
import {
  StyledDay,
  StyledDate,
  StyledDayContent,
  ActionButtons,
} from "./styled";
import { format } from "date-fns";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "../RecipeDetail";
import { StyledActionButton } from "../../components/StyledActionButton";
import { ToggleShoppingCart } from "../ToggleShoppingCart";
import { DeleteDay } from "./DeleteDay";
import PublishIcon from "@material-ui/icons/Publish";
import { RecipeType } from "../../types";
import { DayData } from "./types";

interface Props {
  today: boolean;
  isShoppingCartActive: boolean;
  addToTrelloActive: boolean;
  date: Date;
  reset: () => void;
  setShowDeleteConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteConfirm: boolean;
  dayData: DayData;
  toggleShoppingCart: (date: Date) => void;
  recipe: RecipeType;
}

export function RecipeSelected({
  today,
  isShoppingCartActive,
  addToTrelloActive,
  date,
  reset,
  setShowDeleteConfirmed,
  showDeleteConfirm,
  dayData,
  toggleShoppingCart,
  recipe,
}: Props) {
  const [showImageUpload, setShowImageUpload] = useState(false);

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
          <div
            onClick={() =>
              addToTrelloActive ? toggleShoppingCart(date) : null
            }
          >
            <RecipeDetails
              recipe={recipe}
              showImageUpload={showImageUpload}
              setShowImageUpload={setShowImageUpload}
            />
            <ActionButtons>
              <StyledActionButton
                style={{ marginRight: "6px" }}
                onClick={() => setShowImageUpload(true)}
              >
                <PublishIcon fontSize="large" />
              </StyledActionButton>
              {!showDeleteConfirm && (
                <ToggleShoppingCart recipeId={recipe?.id} />
              )}
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
