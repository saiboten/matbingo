import React, { useContext, useState } from "react";
import Creatable from "react-select/creatable";
import { RecipeContext } from "../context/RecipeContext";
import { RouteComponentProps, Redirect } from "react-router";
import { RecipeType, Ingredient } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledActionButton } from "../components/StyledActionButton";
import { Form, Field } from "react-final-form";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledError } from "../components/StyledError";
import { StyledInput } from "../components/StyledInput";
import { StyledButton } from "../components/StyledButton";
import { SelectWrapper } from "../components/StyledSelectWrapper";
import { StyledTextArea } from "../components/StyledTextArea";
import { ValueType } from "react-select";
import { StyledLoader } from "../components/StyledLoader";
import { StyledRatingContainer } from "../components/StyledRatingContainer";
import { createRatings } from "../components/StyledRatings";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledNotification } from "../components/StyledNotification";
import { ListRecipesAndRedirect } from "./ListRecipesAndRedirect";
import { StyledDeleteIcon } from "../components/StyledSvgIcons";
import { UserDataContext } from "../context/UserDataContext";
import { useIngredients } from "../hooks/useIngredients";

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {}

const onSubmit = (
  documentId: string,
  values: any,
  form: any,
  group: string
) => {
  const db = firebase.firestore();
  values.ingredients = values.ingredients ? values.ingredients : [];

  const createThese = values.ingredients
    .filter((el: any) => el.__isNew__)
    .map((el: any) => el.label);

  values.ingredients = values.ingredients.filter(
    (el: any) => typeof el.__isNew__ === "undefined"
  );

  const createPromises: any = createThese.map((ingredientToBeCreated: string) =>
    db.collection("ingredients").add({
      name: ingredientToBeCreated,
      group
    })
  );

  Promise.all(createPromises).then((newDocs: any) => {
    const newIds = newDocs.map((el: any) => el.id);

    db.collection("recipes")
      .doc(documentId)
      .update({
        ...values,
        rating: parseInt(values.rating, 10),
        ingredients: values.ingredients
          .map((el: ValueType<any>) => el.value)
          .concat(newIds)
      });
  });
};

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
}

const validate = (values: any) => {
  let errors: RecipeErrors = { name: undefined, description: undefined };

  if (!values.name) {
    errors.name = "Oppskriften må ha et navn";
  }

  return errors;
};

function deleteItem(id: string, setNextPage: (nextPage: string) => void) {
  const db = firebase.firestore();
  db.collection("recipes")
    .doc(id)
    .delete();
  setNextPage("/recipe-feedback/delete");
}

const ReactSelectAdapter = ({ input, ...rest }: any) => {
  return <Creatable {...input} {...rest} />;
};

export const EditRecipeDetails = ({
  match: {
    params: { id }
  }
}: Props) => {
  const recipes = useContext(RecipeContext);
  const userdata = useContext(UserDataContext).userdata;
  const [ingredientsLoading, ingredients] = useIngredients();

  const [nextPage, setNextPage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (ingredientsLoading) {
    return <StyledLoader />;
  }

  const recipeDetails: RecipeType = recipes.recipes.find(
    recipe => recipe.id === id
  ) || {
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

  if (nextPage !== "") {
    return <Redirect push to={nextPage} />;
  }

  return (
    <StyledWrapper backgroundColor="white">
      <StyledNotification text="Oppskrift lagret" active={showNotification} />
      <ListRecipesAndRedirect />
      <StyledHeaderH1>{recipeDetails.name}</StyledHeaderH1>

      <Form
        initialValues={{
          ...recipeDetails,
          ingredients: recipeDetails.ingredients.map((el: string) => {
            const found = ingredients.find(
              (option: Ingredient) => option.id === el
            ) || {
              name: "",
              id: ""
            };

            return {
              label: found.name,
              value: found.id
            };
          })
        }}
        onSubmit={(values, form) => {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 2000);
          onSubmit(recipeDetails.id, values, form, userdata.group);
        }}
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <React.Fragment>
            <StyledForm
              onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
                const promise = handleSubmit(event);
                if (promise) {
                  // promise.then(reset); // reset
                }
              }}
            >
              <StyledFieldSet>
                <Field name="name" component="input" type="text">
                  {({ input, meta }: { input: any; meta: any }) => (
                    <>
                      <StyledInputLabel>Oppskrift</StyledInputLabel>

                      <StyledInputWrapper>
                        {meta.error && meta.touched && (
                          <StyledError>{meta.error}</StyledError>
                        )}
                        <StyledInput
                          autoComplete="off"
                          placeholder="Navn på oppskrift"
                          {...input}
                        />
                      </StyledInputWrapper>
                    </>
                  )}
                </Field>
              </StyledFieldSet>
              <StyledFieldSet>
                <Field name="description" component="input" type="text">
                  {({ input, meta }: { input: any; meta: any }) => (
                    <>
                      <StyledInputLabel>Beskrivelse</StyledInputLabel>
                      <StyledInputWrapper>
                        {meta.error && meta.touched && (
                          <StyledError>{meta.error}</StyledError>
                        )}
                        <StyledTextArea
                          autoComplete="off"
                          placeholder="Beskrivelse"
                          {...input}
                        />
                      </StyledInputWrapper>
                    </>
                  )}
                </Field>
              </StyledFieldSet>
              <label>Frekvens</label>
              <StyledRatingContainer>{createRatings()}</StyledRatingContainer>
              <label>Legg til ingredienser</label>
              <SelectWrapper>
                <Field
                  name="ingredients"
                  component={ReactSelectAdapter}
                  isMulti
                  options={ingredients.map(el => ({
                    label: el.name,
                    value: el.id
                  }))}
                />
              </SelectWrapper>

              <div>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="monday"
                  />{" "}
                  Mandag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="tuesday"
                  />{" "}
                  Tirsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="wednesday"
                  />{" "}
                  Onsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="thursday"
                  />{" "}
                  Torsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="friday"
                  />{" "}
                  Fredag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="saturday"
                  />{" "}
                  Lørdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="weekdays"
                    component="input"
                    type="checkbox"
                    value="sunday"
                  />{" "}
                  Søndag
                </StyledInputLabel>
              </div>
              <div>
                <label style={{ display: "block" }}>Type rett</label>
                <StyledInputLabel>
                  <Field
                    name="recipetype"
                    component="input"
                    type="checkbox"
                    value="meat"
                  />{" "}
                  Kjøtt
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="recipetype"
                    component="input"
                    type="checkbox"
                    value="fish"
                  />{" "}
                  Fisk
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="recipetype"
                    component="input"
                    type="checkbox"
                    value="vegetarian"
                  />{" "}
                  Vegetar
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field
                    name="recipetype"
                    component="input"
                    type="checkbox"
                    value="other"
                  />{" "}
                  Annet
                </StyledInputLabel>
              </div>

              <StyledButton type="submit">Lagre</StyledButton>
            </StyledForm>
            <StyledActionButton
              style={{
                transition: "all .3s",
                transform: `scale(${confirmDelete ? 1.4 : 1})`
              }}
              onClick={() =>
                confirmDelete
                  ? deleteItem(recipeDetails.id, setNextPage)
                  : setConfirmDelete(true)
              }
            >
              <StyledDeleteIcon color="white" />
            </StyledActionButton>
          </React.Fragment>
        )}
      />
    </StyledWrapper>
  );
};
