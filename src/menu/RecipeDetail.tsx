import React, { useContext } from "react";
import styled from "styled-components";
import { RecipeType, Ingredient, Unit } from "../types";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { IngredientsContext } from "../context/IngredientsContext";
import { StyledActionButton } from "../components/StyledActionButton";
import { UserData, UserDataContext } from "../context/UserDataContext";

const StyledWrapper = styled.div`
  max-width: 480px;
`;

interface Props {
  recipe: RecipeType;
}

const StyledUl = styled.ul`
  text-align: left;
  display: inline-block;
  margin-top: 10px;
`;

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-bottom: 10px;
`;

interface CreateCardResponse {
  id: string;
}
interface CreateChecklistResponse {
  id: string;
}

const AddIngredients = (
  ingredients: Ingredient[],
  userdata: UserData,
  checklistId: string
) => {
  ingredients.forEach(ingredient => {
    fetch(
      `https://api.trello.com/1/checklists/${checklistId}/checkItems?key=${
        userdata.trelloApiKey
      }&token=${userdata.trelloApiToken}&name=${ingredient.name}`,
      {
        method: "POST"
      }
    );
  });
};

const AddChecklist = (
  ingredients: Ingredient[],
  userdata: UserData,
  id: string
) => {
  fetch(
    `https://api.trello.com/1/checklists/?key=${userdata.trelloApiKey}&token=${
      userdata.trelloApiToken
    }&idCard=${id}`,
    {
      method: "POST"
    }
  )
    .then(data => data.json())
    .then((data: CreateChecklistResponse) => {
      AddIngredients(ingredients, userdata, data.id);
    });
};

const Generate = (ingredients: Ingredient[], userdata: UserData) => {
  fetch(
    `https://api.trello.com/1/cards?name=Handleliste&pos=top&idList=${
      userdata.trelloList
    }&key=${userdata.trelloApiKey}&token=${userdata.trelloApiToken}`,
    {
      method: "POST"
    }
  )
    .then((data: any) => data.json())
    .then((data: CreateCardResponse) => {
      AddChecklist(ingredients, userdata, data.id);
    });
};

export const RecipeDetails = ({
  recipe: { name, description, ingredients }
}: Props) => {
  const ingredientsFromContext = useContext(IngredientsContext).ingredients;
  const userdata = useContext(UserDataContext).userdata;

  const ingredientsStrings: Ingredient[] = ingredients.map(ingredient => {
    const res = ingredientsFromContext.find(el => el.id === ingredient);
    return (
      res || {
        name: "",
        unit: "Units" as Unit,
        id: ""
      }
    );
  });

  return (
    <StyledWrapper>
      <StyledHeaderH1>{name}</StyledHeaderH1>
      <StyledActionButton
        onClick={() => Generate(ingredientsStrings, userdata)}
      >
        Generer
      </StyledActionButton>
      {description && (
        <>
          <StyledEmpesizedP>Beskrivelse</StyledEmpesizedP>
          <p>{description}</p>
        </>
      )}
      <StyledUl>
        {ingredientsStrings.length > 0 && (
          <>
            <StyledEmpesizedP>Ingredienser</StyledEmpesizedP>
            {ingredientsStrings.map((i: any) => (
              <li key={i.name}>{i.name}</li>
            ))}
          </>
        )}
      </StyledUl>
    </StyledWrapper>
  );
};
