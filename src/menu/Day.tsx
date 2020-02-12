import React, { useEffect, useState, useContext } from "react";
import { format, isToday } from "date-fns";
import styled from "styled-components";
import { firebase } from "../firebase/firebase";
import { RecipeType } from "../types";
import nbLocale from "date-fns/locale/nb";
import { RecipeDetails } from "./RecipeDetail";
import { GenerateDay } from "./GenerateDay";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { primaryColor, secondaryColor } from "../components/Constants";
import { UserDataContext } from "../context/UserDataContext";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import {
  StyledSecondaryActionButtonForText,
  StyledActionButton,
  StyledActionButtonForText
} from "../components/StyledActionButton";
import { Filter } from "./Filter";
import { StyledDeleteIcon } from "../components/StyledSvgIcons";
import { useRecipes } from "../hooks/useRecipes";

interface Props {
  date: Date;
  addToTrelloActive: boolean;
  toggleShoppingCart: (date: Date) => void;
  isShoppingCartActive: boolean;
  activeFilters: Filter[];
}

interface StyledDayProps {
  active: boolean;
  selected: boolean;
}

const StyledDay = styled.div<StyledDayProps>`
  position: relative;
  width: 48%;
  display: inline-block;
  text-align: left;
  margin: 5px;
  min-height: 100px;
  color: #000;

  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  border: ${props => (props.active ? `2px solid ${secondaryColor}` : "none")};

  @media screen and (max-width: 530px) {
    width: 100%;
  }
  background-color: ${props => (props.selected ? `${primaryColor}` : "#fff")};
`;

const StyledDate = styled.div`
  position: absolute;
  left: 2px;
  top: 2px;
  font-size: 1.6rem;
  background: white;
  z-index: 1;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
`;

const CustomStyledDeleteIcon = styled(StyledDeleteIcon)`
  fill: white;
`;

const initialState: RecipeType = {
  name: "",
  description: "",
  id: "",
  ingredients: [],
  weekdays: [],
  lastTimeSelected: new Date(),
  rating: 1,
  hasBeenSelected: false,
  recipetype: []
};

interface DayData {
  id: string;
  date: Date;
  group: string;
  recipe: string | undefined;
  description: string | undefined;
}

const initialDayData: DayData = {
  id: "",
  date: new Date(),
  group: "",
  recipe: undefined,
  description: undefined
};

const StyledDayContent = styled.div`
  text-align: center;
`;

const StyledLocalLoaderWithMarginTop = styled(StyledLocalLoader)`
  margin-top: 42px;
`;

const DeleteDay = ({
  documentId,
  reset
}: {
  documentId: string;
  reset: () => void;
}) => {
  const [showConfirm, setConfirmed] = useState(false);

  const deleteDay = () => {
    if (showConfirm) {
      const db = firebase.firestore();
      db.collection("days")
        .doc(documentId)
        .delete()
        .then(() => {
          reset();
        });
    } else {
      setConfirmed(true);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "0",
        top: "0",
        marginRight: "5px",
        marginTop: "5px"
      }}
    >
      {showConfirm && (
        <StyledSecondaryActionButtonForText
          style={{ marginRight: "10px" }}
          onClick={() => setConfirmed(false)}
        >
          Avbryt
        </StyledSecondaryActionButtonForText>
      )}

      {showConfirm ? (
        <StyledActionButtonForText onClick={deleteDay}>
          Sikker?
        </StyledActionButtonForText>
      ) : (
        <StyledActionButton onClick={deleteDay}>
          <CustomStyledDeleteIcon />
        </StyledActionButton>
      )}
    </div>
  );
};

export const Day = ({
  date,
  addToTrelloActive,
  toggleShoppingCart,
  isShoppingCartActive,
  activeFilters
}: Props) => {
  const [recipe, setRecipe]: [RecipeType, any] = useState(initialState);
  const [dayData, setDayData]: [DayData, any] = useState(initialDayData);
  const [loading, setLoading]: any = useState(true);

  const [recipesLoading, recipes] = useRecipes();
  const userdata = useContext(UserDataContext).userdata;

  const reset = () => {
    setDayData(initialDayData);
    setRecipe(initialState);
  };

  useEffect(
    () => {
      reset();
      const db = firebase.firestore();
      const daysQuery = db
        .collection("days")
        .where("date", "==", date)
        .where("group", "==", userdata.group);
      const unsub = daysQuery.onSnapshot(daysMatchesDoc => {
        if (daysMatchesDoc.empty) {
          setLoading(false);
        }

        daysMatchesDoc.forEach(daysMatch => {
          const dayData: any = daysMatch.data();
          setLoading(false);
          setDayData({
            id: daysMatch.id,
            ...dayData
          });

          if (dayData.recipe) {
            const recipe = recipes.find(el => el.id === dayData.recipe);

            if (recipe) {
              setRecipe(recipe);
            }
          }
        });
      });
      return () => {
        unsub();
      };
    },
    [date, recipes, userdata.group]
  );

  const today = isToday(date);

  if (recipesLoading) {
    return <StyledLocalLoader />;
  }

  return (
    <StyledDay
      active={today}
      selected={isShoppingCartActive && addToTrelloActive}
    >
      <StyledDate>
        {format(date, "dddd DD.MM", { locale: nbLocale })}
      </StyledDate>
      <StyledDayContent>
        {loading ? (
          <StyledLocalLoaderWithMarginTop />
        ) : (
          <>
            {dayData.description && (
              <div style={{ marginTop: "2.5rem" }}>
                {today && <div>Hva skjer i dag?: </div>}
                <StyledHeaderH1NoMarginTop>
                  {dayData.description}
                </StyledHeaderH1NoMarginTop>
                <DeleteDay documentId={dayData.id} reset={reset} />
              </div>
            )}
            {recipe.name !== "" && (
              <div
                onClick={() =>
                  addToTrelloActive ? toggleShoppingCart(date) : null
                }
              >
                <RecipeDetails today={today} recipe={recipe} />
                <DeleteDay documentId={dayData.id} reset={reset} />
              </div>
            )}
            {recipe.name === "" && !dayData.description && (
              <GenerateDay date={date} activeFilters={activeFilters} />
            )}
          </>
        )}
      </StyledDayContent>
    </StyledDay>
  );
};
