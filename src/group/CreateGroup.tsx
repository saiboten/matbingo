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

interface GroupInfo {
  participants: Participant[];
  groupName: string;
}

const ConfirmGroupInfo = ({ groupInfo }: { groupInfo: GroupInfo }) => {
  return (
    <StyledWrapper backgroundColor="white">
      <h1>Gruppe: {groupInfo.groupName}</h1>

      <div>Alle deltagere vil få en epost med info</div>

      {groupInfo.participants.map(participant => (
        <li>
          {participant.name} - {participant.email}
        </li>
      ))}
      <StyledButton>Opprett gruppe</StyledButton>
    </StyledWrapper>
  );
};

export const CreateGroup = () => {
  const [groupInfo, setGroupInfo] = useState(null);

  const onSubmit = (values: any) => {
    console.log(values);
    setGroupInfo(values);
  };

  if (groupInfo) {
    return <ConfirmGroupInfo groupInfo={groupInfo} />;
  }

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
                onClick={() => push("participants", undefined)}
              >
                Legg til deltaker
              </StyledButton>
            </StyledFieldSet>
            <FieldArray name="participants">
              {({ fields }) =>
                fields.map((name, index) => (
                  <div
                    key={name}
                    style={{
                      border: "1px solid black",
                      marginBottom: "1rem",
                      paddingRight: "1rem"
                    }}
                  >
                    <StyledFieldSet>
                      <StyledInputLabel>Deltagernavn</StyledInputLabel>
                      <Field name={`${name}.name`} component="input">
                        {({ input }: { input: any }) => (
                          <StyledInput placeholder="Navn" {...input} />
                        )}
                      </Field>
                    </StyledFieldSet>

                    <StyledFieldSet>
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
                    </StyledFieldSet>
                  </div>
                ))
              }
            </FieldArray>
            <StyledButton type="submit" disabled={pristine || invalid}>
              Gå videre
            </StyledButton>
          </StyledForm>
        )}
      />
    </StyledWrapper>
  );
};
