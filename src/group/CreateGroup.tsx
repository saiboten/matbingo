import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { StyledHeaderH1, StyledHeaderH2 } from "../components/StyledHeaderH1";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { StyledButton } from "../components/StyledButton";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";

interface Participant {
  name: string;
  email: string;
}

const AddGroupParticipants = () => {
  const [participants, setParticipants]: [Participant[], any] = useState([]);

  const tmp = participants.map(el => (
    <li>
      {el.name} - {el.email}
    </li>
  ));

  const submit = (values: any) => {
    setParticipants([...participants, { ...values }]);
  };

  return (
    <div>
      <Form
        onSubmit={submit}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <Field name="name" component="input" type="text">
              {({ input }: { input: any }) => (
                <StyledInput placeholder="Navn" {...input} />
              )}
            </Field>
            <Field name="email" component="input" type="text">
              {({ input }: { input: any }) => (
                <StyledInput placeholder="Epost" {...input} />
              )}
            </Field>
            <input type="submit" value="OK" />
          </form>
        )}
      />
      {tmp}
    </div>
  );
};

export const CreateGroup = () => {
  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Opprett gruppe</StyledHeaderH1>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine, invalid }) => (
          <StyledForm onSubmit={handleSubmit}>
            <StyledFieldSet>
              <StyledInputLabel>Velg gruppenavn</StyledInputLabel>
              <Field name="groupName" component="input" type="text">
                {({ input }: { input: any }) => (
                  <StyledInput placeholder="Navn på gruppen din" {...input} />
                )}
              </Field>
            </StyledFieldSet>
            <AddGroupParticipants />
            <StyledButton type="submit" disabled={pristine || invalid}>
              Submit
            </StyledButton>
          </StyledForm>
        )}
      />
    </StyledWrapper>
  );
};
