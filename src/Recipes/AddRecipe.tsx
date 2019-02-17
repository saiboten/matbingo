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
import SelectBase from "react-select";
import { IngredientsContext } from "../context/IngredientsContext";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { SelectWrapper } from "../components/StyledSelectWrapper";
import { StyledTextArea } from "../components/StyledTextArea";

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
}

const onSubmit = (values: any, recipeIngredients: Array<Option>, form: any) => {
  const db = firebase.firestore();

  db.collection("recipes").add({
    ...values,
    ingredients: recipeIngredients.map(el => el.value),
    lastTimeSelected: new Date()
  });

  form.reset();
};

const validate = (values: any) => {
  let errors: RecipeErrors = { name: undefined, description: undefined };

  if (!values.name) {
    errors.name = "Oppskriften må ha et navn";
  }

  return errors;
};

interface Option {
  label: string;
  value: string;
}

export function AddRecipe() {
  const [recipeIngredients, setIngredients] = useState<Array<Option>>([]);

  const handleChange = (selectedOptions: any) => {
    console.log(selectedOptions);
    setIngredients(selectedOptions);
  };

  return (
    <Form
      onSubmit={(values, form) => onSubmit(values, recipeIngredients, form)}
      validate={validate}
      render={({ handleSubmit, submitting, pristine, reset }) => (
        <React.Fragment>
          <StyledHeaderH1>Legg til oppskrift</StyledHeaderH1>
          <StyledForm
            onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
              const promise = handleSubmit(event);
              if (promise) {
                promise.then(reset);
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
            <label>Legg til ingredienser</label>
            <IngredientsContext.Consumer>
              {({ ingredients }) => (
                <SelectWrapper>
                  <SelectBase
                    isMulti
                    onChange={handleChange}
                    options={ingredients.map(el => ({
                      label: el.name,
                      value: el.id
                    }))}
                  />
                </SelectWrapper>
              )}
            </IngredientsContext.Consumer>

            <div>
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
