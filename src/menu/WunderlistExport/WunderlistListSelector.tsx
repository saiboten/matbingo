import React, { ReactElement, useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { StyledHeaderH1 } from "../../components/StyledHeaderH1";
import { StyledActionButtonForText } from "../../components/StyledActionButton";
import { useAsync, useAsyncCallback } from "react-async-hook";
import { StyledLocalLoader } from "../../components/StyledLocalLoader";
import { StyledError } from "../../components/StyledError";
import { WunderlistSelect } from "./WunderlistSelect";
import { WunderlistList, RecipeType, Ingredient } from "../../types";
import { firebase } from "../../firebase/firebase";
import { UserDataContext } from "../../context/UserDataContext";
import { RecipeContext } from "../../context/RecipeContext";
import { IngredientsContext } from "../../context/IngredientsContext";

const clientId = "03d2eac308bd127169f5";
async function fetchLists(accessToken: string) {
  const response = await fetch("https://a.wunderlist.com/api/v1/lists", {
    headers: {
      "X-Access-Token": accessToken,
      "X-Client-ID": clientId
    }
  });
  const lists = (await response.json()) as Promise<WunderlistList[]>;
  return lists;
}

async function submitIngredient(accessToken: string, listId: number, ingredient: string) {
  return await fetch("https://a.wunderlist.com/api/v1/tasks", {
    method: 'POST',
    body: JSON.stringify({
      'list_id': listId,
      'title': ingredient
    }),
    headers: {
      "Content-Type": "application/json",
      "X-Access-Token": accessToken,
      "X-Client-ID": clientId
    }
  });
}

async function getIngredientsForWeek(listOfDays: Date[], userGroup: string, ingredients: Ingredient[], recipes: RecipeType[]) {
  const db = firebase.firestore();
  const promiseList: any = [];
  listOfDays.forEach((day: any) => {
    promiseList.push(
      db
        .collection("days")
        .where("group", "==", userGroup)
        .where("date", "==", day)
        .get()
    );
  });

  return Promise.all(promiseList).then(data => {
    const res = data.reduce((init: any, next: any) => {
      if (next.docs[0] && next.docs[0].exists) {
        init.push(next.docs[0].data());
      }
      return init;
    }, []) as RecipeType[];
    const recipeIds = res
      .filter(({ recipe }: any ) => recipe)
      .map((el : any) => el.recipe) as string[];
    const recipesThisWeek: RecipeType[] = recipeIds.map((recipeId: string) =>
      recipes.find(el => el.id === recipeId)
    ) as RecipeType[];

    const ingredientsThisWeek = recipesThisWeek
      .reduce((init: any, recipe: RecipeType) => {
        const ingredientsOnThisRecipe = recipe.ingredients.map(ingredientId =>
          ingredients.find(el => el.id === ingredientId)
        );

        return init.concat(ingredientsOnThisRecipe);
      }, [])
      .map((ingredient: Ingredient) => ingredient.name);
    return ingredientsThisWeek;
  });
}


interface UploadIngredientsRequest {
  accessToken: string;
  listId: number;
  selectedDays: Date[];
  ingredients: Ingredient[];
  recipes: RecipeType[];
  userGroup: string;
}
async function submitIngredients({ accessToken, listId, selectedDays, ingredients, recipes, userGroup } : UploadIngredientsRequest) {
  console.log('submitting...');
  const ingredientsToUpload = await getIngredientsForWeek(selectedDays, userGroup, ingredients, recipes);
  for(let i = 0; i < ingredientsToUpload.length;i++) {
    const ingredient = ingredientsToUpload[i];
    const result = await submitIngredient(accessToken, listId, ingredientsToUpload[i]);
    if (!result.ok) {
      throw new Error(`Failed to submit new wunderlist task for ingredient '${ingredient}' to list ${listId}`);
    }
  }
  console.log('submitted!')

}

const DimmedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.8);
  padding-top: 5rem;
  z-index: 1;
`;
const Wrapper = styled.div`
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 24px;
  background: white;
  width: 95vw;
  max-width: 500px;
  z-index: 2;
`;

const Logo = styled.img`
  height: 90px;
  width: 90px;
  margin: 0 auto;
  display: block;
`;

const LoaderWrapper = styled.div`
  display: flex;
`;

const Button = styled(StyledActionButtonForText)`
  margin-top: 12px;
`;

function SubmitSuccess(): ReactElement<ContentProps> {
  return (
    <StyledHeaderH1>
      Fullført! <span role="img" aria-label="Confetti">🎉🎉🎉</span>
    </StyledHeaderH1>
  );
}


interface ContentProps {
  accessToken: string;
  selectedDays: Date[];
}
function Content({ accessToken, selectedDays }: ContentProps): ReactElement<ContentProps> {
  const fetchListHook = useAsync(fetchLists, [accessToken]);
  const [selectedList, setSelectedList] = useState<number>(-1);
  const { loading } = fetchListHook;
  const lists = fetchListHook.result;
  const fetchError = fetchListHook.error;

  const userGroup = useContext(UserDataContext).userdata.group;
  const recipes = useContext(RecipeContext).recipes;
  const ingredients = useContext(IngredientsContext).ingredients;

  const asyncOnClick = useAsyncCallback(() => submitIngredients({
    accessToken,
    ingredients,
    listId: selectedList,
    recipes,
    userGroup,
    selectedDays
  }));
  const submitStatus = asyncOnClick.status;

  useEffect(() => {
    if (lists && lists.length > 0) {
      setSelectedList(lists[0].id);
    }
  }, [lists])
  if (loading || submitStatus === 'loading') {
    return <LoaderWrapper><StyledLocalLoader /></LoaderWrapper>;
  }
  if (fetchError || asyncOnClick.error) {
    return <StyledError>Noe gikk galt!</StyledError>;
  }
  if(submitStatus === 'success') {
    return <SubmitSuccess />;
  }
  return (
    <>
      <Logo src="wunderlist-logo.png" alt="Logo of wunderlist app" />
      <StyledHeaderH1>Velg liste</StyledHeaderH1>
      {lists && (
        <WunderlistSelect
          options={lists}
          selectedList={selectedList as number}
          setSelectedList={setSelectedList}
        />)
      }
      <Button disabled={!lists} onClick={asyncOnClick.execute}>
        Eksporter
      </Button>
    </>
  );
}

interface Props {
  onDismiss: () => void;
  accessToken: string;
  selectedDays: Date[];
}
export function WunderlistListSelector({
  onDismiss,
  accessToken,
  selectedDays
}: Props): ReactElement<Props> {

  return (
    <>
      <DimmedBackground onClick={onDismiss} />
      <Wrapper>
        <Content accessToken={accessToken} selectedDays={selectedDays} />
      </Wrapper>
    </>
  );
}
