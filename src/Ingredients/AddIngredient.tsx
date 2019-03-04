import React from "react";
import styled from "styled-components";
import { Field, Form } from "react-final-form";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledError } from "../components/StyledError";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledButton } from "../components/StyledButton";
import { StyledRadio, StyledRadioLabel } from "../components/StyledRadio";
import { UserContext } from "../context/UserContext";

interface IngredientErrors {
  name: string | undefined;
}

const StyledInputLabel = styled.label`
  padding: 10px;
  display: inline-block;
`;

const StyledUnits = styled.div`
  display: flex;
  justify-content: center;
`;

const onSubmit = (values: any, reset: () => void) => {
  const db = firebase.firestore();

  db.collection("ingredients").add({
    ...values
  });

  reset();
};

const validate = (values: any) => {
  let errors: IngredientErrors = { name: undefined };

  if (!values.name) {
    errors.name = "Ingrediens kan ikke være tom";
  }
  return errors;
};

export function AddIngredient() {
  return (
    <UserContext.Consumer>
      {({ user }) => (
        <Form
          onSubmit={(values, form) => onSubmit(values, form.reset)}
          validate={validate}
          render={({ handleSubmit, submitting, pristine }) => (
            <React.Fragment>
              <StyledHeaderH1>Legg til ingrediens</StyledHeaderH1>
              <StyledForm onSubmit={handleSubmit}>
                <StyledFieldSet>
                  <Field name="name" component="input" type="text">
                    {({ input, meta }: { input: any; meta: any }) => (
                      <>
                        <StyledInputLabel>Ingrediens</StyledInputLabel>
                        <StyledInputWrapper>
                          {meta.error && meta.touched && (
                            <StyledError>{meta.error}</StyledError>
                          )}
                          <StyledInput
                            autoComplete="off"
                            placeholder="Navn på ingrediens"
                            {...input}
                          />
                        </StyledInputWrapper>
                      </>
                    )}
                  </Field>
                </StyledFieldSet>
                <StyledUnits>
                  <StyledRadio
                    id="kg"
                    name="unit"
                    component="input"
                    type="radio"
                    value="kg"
                  />
                  <StyledRadioLabel htmlFor="kg">Kilo</StyledRadioLabel>
                  <StyledRadio
                    id="liter"
                    name="unit"
                    component="input"
                    type="radio"
                    value="liter"
                  />
                  <StyledRadioLabel htmlFor="liter">Liter</StyledRadioLabel>
                  <StyledRadio
                    id="units"
                    name="unit"
                    component="input"
                    type="radio"
                    value="units"
                  />
                  <StyledRadioLabel htmlFor="units">Stk</StyledRadioLabel>
                </StyledUnits>
                <StyledButton type="submit" disabled={pristine || submitting}>
                  Legg til
                </StyledButton>
              </StyledForm>
            </React.Fragment>
          )}
        />
      )}
    </UserContext.Consumer>
  );
}
