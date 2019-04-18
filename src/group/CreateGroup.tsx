import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { StyledHeaderH1, StyledHeaderH2 } from "../components/StyledHeaderH1";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { StyledButton } from "../components/StyledButton";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

interface Participant {
  name: string;
  email: string;
}

export const CreateGroup = () => {
  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Opprett gruppe</StyledHeaderH1>
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit,
          form: {
            mutators: { push, pop }
          },
          pristine,
          invalid
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <StyledFieldSet>
              <StyledInputLabel>Velg gruppenavn</StyledInputLabel>
              <Field name="groupName" component="input" type="text">
                {({ input }: { input: any }) => (
                  <StyledInput placeholder="Navn på gruppen din" {...input} />
                )}
              </Field>
            </StyledFieldSet>
            <StyledFieldSet>
              <StyledButton
                type="button"
                onClick={() => push("customers", undefined)}
              >
                Add Customer
              </StyledButton>
            </StyledFieldSet>
            <FieldArray name="customers">
              {({ fields }) =>
                fields.map((name, index) => (
                  <div key={name}>
                    <StyledInputLabel>Deltager</StyledInputLabel>

                    <Field name={`${name}.firstName`} component="input">
                      {({ input }: { input: any }) => (
                        <StyledInput placeholder="Navn" {...input} />
                      )}
                    </Field>

                    <StyledInputLabel>Epost</StyledInputLabel>
                    <Field name={`${name}.email`} component="input">
                      {({ input }: { input: any }) => (
                        <StyledInput placeholder="Epost" {...input} />
                      )}
                    </Field>
                    <span
                      onClick={() => fields.remove(index)}
                      style={{ cursor: "pointer" }}
                    >
                      ❌
                    </span>
                  </div>
                ))
              }
            </FieldArray>
            <StyledButton type="submit" disabled={pristine || invalid}>
              Submit
            </StyledButton>
          </StyledForm>
        )}
      />
    </StyledWrapper>
  );
};
