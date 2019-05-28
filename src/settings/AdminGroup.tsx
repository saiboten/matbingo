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

export const AdminGroup = () => {
  const { groupData } = useContext(GroupDataContext);
  const [showNotification, setShowNotification]: [boolean, any] = useState(
    false
  );

  const onSubmit = (values: any) => {
    if (values.groupName !== groupData.name) {
      const db = firebase.firestore();
      const groupDocRef = db.collection("groups").doc(groupData.id);
      groupDocRef.update({
        name: values.groupName
      });
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
          groupName: groupData.name
        }}
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine, invalid }) => (
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
            <StyledButton type="submit">Lagre</StyledButton>
          </form>
        )}
      />
    </StyledWrapper>
  );
};
