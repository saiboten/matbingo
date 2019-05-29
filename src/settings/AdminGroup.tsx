import React, { useContext, useState } from "react";
import { StyledWrapper } from "../components/StyledWrapper";
import { StyledHeaderH1, StyledHeaderH2 } from "../components/StyledHeaderH1";
import { GroupDataContext } from "../context/GroupDataContext";
import { Form, Field } from "react-final-form";
import { StyledActionButtonForText } from "../components/StyledActionButton";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledError } from "../components/StyledError";
import { StyledInput } from "../components/StyledInput";
import { StyledButton } from "../components/StyledButton";
import { StyledNotification } from "../components/StyledNotification";
import { firebase } from "../firebase/firebase";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";

export const AdminGroup = () => {
  const { groupData } = useContext(GroupDataContext);
  const [showNotification, setShowNotification]: [boolean, any] = useState(
    false
  );

  const onSubmit = (values: any) => {
    console.log(values);
    let isChanged = false;
    if (values.groupName !== groupData.name) {
      isChanged = true;
      const db = firebase.firestore();
      const groupDocRef = db.collection("groups").doc(groupData.id);
      groupDocRef.update({
        name: values.groupName
      });
    }
    if (isChanged) {
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
  };

  return (
    <StyledWrapper backgroundColor="white">
      <StyledNotification text="Lagret" active={showNotification} />
      <StyledHeaderH1>Administrer gruppe</StyledHeaderH1>
      <StyledHeaderH2>Endre navn</StyledHeaderH2>
      <Form
        initialValues={{
          groupName: groupData.name,
          participants: groupData.invites
        }}
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit,
          pristine,
          invalid,
          form: {
            mutators: { push, pop }
          }
        }) => (
          <form onSubmit={handleSubmit}>
            <StyledFieldSet>
              <Field name="groupName" component="input" type="text">
                {({ input, meta }: { input: any; meta: any }) => (
                  <>
                    <StyledInputLabel>Gruppenavn</StyledInputLabel>

                    <StyledInputWrapper>
                      {meta.error && meta.touched && (
                        <StyledError>{meta.error}</StyledError>
                      )}
                      <StyledInput
                        autoComplete="off"
                        placeholder="Gruppenavn"
                        {...input}
                      />
                    </StyledInputWrapper>
                  </>
                )}
              </Field>
            </StyledFieldSet>
            <StyledFieldSet>
              <StyledButton
                type="button"
                onClick={() => push("participants", undefined)}
              >
                Legg til en epost til
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
                      <StyledInputLabel>Epost</StyledInputLabel>
                      <Field name={`${name}`} component="input">
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
            <StyledButton type="submit">Lagre</StyledButton>
          </form>
        )}
      />
    </StyledWrapper>
  );
};
