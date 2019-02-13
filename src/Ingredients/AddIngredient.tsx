import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Field, Form } from "react-final-form";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledError } from "../components/StyledError";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldset";
import { StyledButton } from "../components/StyledButton";

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

const StyledLabel = styled.label`
  position: relative;
  padding: 10px 20px;
  padding-left: 30px;
  margin-right: 10px;

  &:after {
    position: absolute;
    left: 0;
    top: 7px;
    content: "";
    height: 24px;
    width: 24px;
    border: 1px solid blue;
    border-radius: 50%;
  }

  &:before {
    position: absolute;
    left: 3px;
    top: 10px;
    content: "";
    height: 18px;
    width: 18px;
    background-color: blue;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.2s ease-in;
  }
`;

const StyledRadio = styled(Field)`
  display: none;

  &:checked + ${StyledLabel}::before {
    opacity: 1;
  }
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
              <StyledLabel htmlFor="kg">Kilo</StyledLabel>
              <StyledRadio
                id="liter"
                name="unit"
                component="input"
                type="radio"
                value="liter"
              />
              <StyledLabel htmlFor="liter">Liter</StyledLabel>
              <StyledRadio
                id="units"
                name="unit"
                component="input"
                type="radio"
                value="units"
              />
              <StyledLabel htmlFor="units">Stk</StyledLabel>
            </StyledUnits>
            <StyledButton type="submit" disabled={pristine || submitting}>
              Legg til
            </StyledButton>
          </StyledForm>
        </React.Fragment>
      )}
    />
  );
}
