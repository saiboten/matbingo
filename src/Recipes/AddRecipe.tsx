import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledError } from "../components/StyledError";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledButton } from "../components/StyledButton";
import CreatableSelect from "react-select/lib/Creatable";
import { IngredientsContext } from "../context/IngredientsContext";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { SelectWrapper } from "../components/StyledSelectWrapper";
import { StyledTextArea } from "../components/StyledTextArea";
import { createRatings } from "../components/StyledRatings";
import { StyledRatingContainer } from "../components/StyledRatingContainer";
import { Redirect } from "react-router";

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
  rating: string | undefined;
}

const onSubmit = (values: any, form: any, setDetailsId: any) => {
  if (!values.recipes) {
    values.recipes = [];
  }

  console.log(values);

  const db = firebase.firestore();

  db.collection("recipes")
    .add({
      ...values,
      ingredients: values.recipes.map((el: Option) => el.value),
      lastTimeSelected: new Date(),
      rating: parseInt(values.rating, 10)
    })
    .then(docRef => {
      setDetailsId(docRef.id);
    });

  form.reset();
};

const validate = (values: any) => {
  let errors: RecipeErrors = {
    name: undefined,
    description: undefined,
    rating: undefined
  };

  if (!values.name) {
    errors.name = "Oppskriften må ha et navn";
  }

  if (!values.rating) {
    errors.rating = "Du må oppgi en rating";
  }

  return errors;
};

interface Option {
  label: string;
  value: string;
}

const ReactSelectAdapter = ({ input, ...rest }: any) => {
  return <CreatableSelect {...input} {...rest} />;
};

export function AddRecipe() {
  const [detailsId, setDetailsId] = useState("");

  if (detailsId !== "") {
    return <Redirect to={`/recipes/${detailsId}`} push />;
  }

  return (
    <Form
      onSubmit={(values, form) => onSubmit(values, form, setDetailsId)}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <React.Fragment>
          <StyledHeaderH1>Legg til oppskrift</StyledHeaderH1>
          <StyledForm
            onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) =>
              handleSubmit(event)
            }
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
            <label>Legg til ingredienser</label>
            <IngredientsContext.Consumer>
              {({ ingredients }) => (
                <SelectWrapper>
                  <Field
                    name="recipes"
                    component={ReactSelectAdapter}
                    isMulti
                    options={ingredients.map(el => ({
                      label: el.name,
                      value: el.id
                    }))}
                  />
                </SelectWrapper>
              )}
            </IngredientsContext.Consumer>
            <label>Frekvens</label>
            <StyledRatingContainer>{createRatings()}</StyledRatingContainer>
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
            <StyledButton type="submit" disabled={pristine || submitting}>
              Legg til
            </StyledButton>
          </StyledForm>
        </React.Fragment>
      )}
    />
  );
}
