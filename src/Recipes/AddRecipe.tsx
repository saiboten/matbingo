import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Field, Form } from "react-final-form";
import { firebase } from "../firebase/firebase";

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
}

const StyledForm = styled.form`
  text-align: left;
  margin-bottom: 24px;
`;

const StyledHeaderH1 = styled.h1`
  margin-top: 24px;
  text-align: center;
  margin-bottom: 24px;
`;

const StyledError = styled.div`
  position: absolute;
  color: red;
  right: -188px;
  top: 10px;
`;

const StyledFieldSet = styled.fieldset`
  position: relative;
  border: none;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const StyledInputLabel = styled.label`
  padding: 10px;
  display: inline-block;
`;

const StyledInput = styled.input`
  float: right;
  padding: 10px;
  text-align: center;
`;

const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const onSubmit = (values: any) => {
  const db = firebase.firestore();

  db.collection("recipes").add({
    ...values
  });
};

const validate = (values: any) => {
  let errors: RecipeErrors = { name: undefined, description: undefined };

  if (!values.name) {
    errors.name = "<-- Ingrediens kan ikke være tom";
  }

  return errors;
};

export function AddRecipe() {
  return (
    <Form
      onSubmit={values => onSubmit(values)}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <React.Fragment>
          <StyledHeaderH1>Legg til oppskrift</StyledHeaderH1>
          <StyledForm onSubmit={handleSubmit}>
            <StyledFieldSet>
              <Field name="name" component="input" type="text">
                {({ input, meta }: { input: any; meta: any }) => (
                  <>
                    <StyledInputLabel>Oppskrift</StyledInputLabel>
                    <StyledInput
                      autoComplete="off"
                      placeholder="Navn på oppskrift"
                      {...input}
                    />
                    {meta.error && meta.touched && (
                      <StyledError>{meta.error}</StyledError>
                    )}
                  </>
                )}
              </Field>
              <Field name="description" component="input" type="text">
                {({ input, meta }: { input: any; meta: any }) => (
                  <>
                    <StyledInputLabel>Beskrivelse</StyledInputLabel>
                    <StyledInput
                      autoComplete="off"
                      placeholder="Beskrivelse"
                      {...input}
                    />
                    {meta.error && meta.touched && (
                      <StyledError>{meta.error}</StyledError>
                    )}
                  </>
                )}
              </Field>
            </StyledFieldSet>
            <StyledButton type="submit" disabled={pristine || submitting}>
              Legg til
            </StyledButton>
          </StyledForm>
        </React.Fragment>
      )}
    />
  );
}
