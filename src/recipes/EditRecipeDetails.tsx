import React, { useContext, useState } from "react";
import Creatable from "react-select/creatable";
import { RouteComponentProps, Redirect } from "react-router";
import PublishIcon from "@material-ui/icons/Publish";
import { RecipeType, Ingredient } from "../types";
import { firebase } from "../firebase/firebase";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButton,
  StyledActionButtonWithMargins,
} from "../components/StyledActionButton";
import { Form, Field } from "react-final-form";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledError } from "../components/StyledError";
import { StyledInput } from "../components/StyledInput";
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
import { useRecipes } from "../hooks/useRecipes";
import styled from "styled-components";
import { Checkbox } from "@material-ui/core";
import { RecipeDetails } from "../menu/RecipeDetail";

const Buttons = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

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
      group,
    })
  );

  Promise.all(createPromises).then((newDocs: any) => {
    const newIds = newDocs.map((el: any) => el.id);

    console.log(values.public);

    db.collection("recipes")
      .doc(documentId)
      .update({
        ...values,
        rating: parseInt(values.rating, 10),
        public: values.public,
        ingredients: values.ingredients
          .map((el: ValueType<any>) => el.value)
          .concat(newIds),
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
  db.collection("recipes").doc(id).delete();
  setNextPage("/recipe-feedback/delete");
}

const ReactSelectAdapter = ({ input, ...rest }: any) => {
  return <Creatable {...input} {...rest} />;
};

export const EditRecipeDetails = ({
  match: {
    params: { id },
  },
}: Props) => {
  const [recipesLoading, recipes] = useRecipes();
  const userdata = useContext(UserDataContext).userdata;
  const [ingredientsLoading, ingredients] = useIngredients();

  const [nextPage, setNextPage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const recipeDetails: RecipeType = recipes.find(
    (recipe) => recipe.id === id
  ) || {
    name: "",
    description: "",
    id: "",
    ingredients: [],
    weekdays: [],
    lastTimeSelected: new Date(),
    rating: 1,
    hasBeenSelected: false,
    recipetype: [],
    image: undefined,
  };

  if (ingredientsLoading || recipesLoading) {
    return <StyledLoader />;
  }

  if (nextPage !== "") {
    return <Redirect push to={nextPage} />;
  }

  return (
    <StyledWrapper backgroundColor="white">
      <StyledNotification text="Oppskrift lagret" active={showNotification} />
      <ListRecipesAndRedirect />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ border: "1px solid black", position: "relative" }}>
          <RecipeDetails
            recipe={recipeDetails}
            showImageUpload={showImageUpload}
            setShowImageUpload={setShowImageUpload}
          />
          {!showImageUpload && (
            <StyledActionButtonWithMargins
              style={{
                position: "absolute",
                right: "0",
                top: "0",
              }}
              onClick={() => setShowImageUpload(true)}
            >
              <PublishIcon fontSize="large" />
            </StyledActionButtonWithMargins>
          )}
        </div>
      </div>

      <Form
        initialValues={{
          ...recipeDetails,
          ingredients: recipeDetails.ingredients.map((el: string) => {
            const found = ingredients.find(
              (option: Ingredient) => option.id === el
            ) || {
              name: "",
              id: "",
            };

            return {
              label: found.name,
              value: found.id,
            };
          }),
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
                <Field name="link" component="input" type="text">
                  {({ input, meta }: { input: any; meta: any }) => (
                    <>
                      <StyledInputLabel>Lenke</StyledInputLabel>

                      <StyledInputWrapper>
                        {meta.error && meta.touched && (
                          <StyledError>{meta.error}</StyledError>
                        )}
                        <StyledInput
                          autoComplete="off"
                          placeholder="Lenke til oppskrift"
                          {...input}
                        />
                      </StyledInputWrapper>
                    </>
                  )}
                </Field>
              </StyledFieldSet>
              <StyledFieldSet wide>
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
                  options={ingredients.map((el) => ({
                    label: el.name,
                    value: el.id,
                  }))}
                />
              </SelectWrapper>

              <div>
                <StyledInputLabel>
                  <Field name="weekdays" value="monday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "monday"} {...input} />
                    )}
                  </Field>
                  Mandag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="tuesday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "tuesday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Tirsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="wednesday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "wednesday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Onsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="thursday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "thursday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Torsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="friday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "friday"} {...input} />
                    )}
                  </Field>
                  Fredag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="saturday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "saturday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Lørdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="sunday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "sunday"} {...input} />
                    )}
                  </Field>
                  Søndag
                </StyledInputLabel>
              </div>
              <div>
                <label style={{ display: "block" }}>Type rett</label>
                <StyledInputLabel>
                  <Field name="recipetype" value="meat" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "meat"} {...input} />
                    )}
                  </Field>
                  Kjøtt
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="recipetype" value="fish" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "fish"} {...input} />
                    )}
                  </Field>
                  Fisk
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="recipetype" value="vegetarian" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "vegetarian"}
                        {...input}
                      />
                    )}
                  </Field>
                  Vegetar
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="recipetype" value="other" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "other"} {...input} />
                    )}
                  </Field>
                  Annet
                </StyledInputLabel>
              </div>

              <StyledInputLabel>
                <Field name="public" type="checkbox">
                  {({ input }: any) => (
                    <Checkbox checked={input.value} {...input} />
                  )}
                </Field>
                Offentlig oppskrift
              </StyledInputLabel>

              <br />

              <Buttons>
                <StyledActionButtonForText type="submit">
                  Lagre
                </StyledActionButtonForText>
                <StyledSecondaryActionButton
                  style={{
                    marginLeft: "1rem",
                    transition: "all .3s",
                    transform: `scale(${confirmDelete ? 1.4 : 1})`,
                  }}
                  onClick={() =>
                    confirmDelete
                      ? deleteItem(recipeDetails.id, setNextPage)
                      : setConfirmDelete(true)
                  }
                >
                  <StyledDeleteIcon />
                </StyledSecondaryActionButton>
              </Buttons>
            </StyledForm>
          </React.Fragment>
        )}
      />
    </StyledWrapper>
  );
};
