import React, { useContext } from "react";
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

export const AdminGroup = () => {
  const { groupData } = useContext(GroupDataContext);

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <StyledWrapper backgroundColor="white">
      <StyledHeaderH1>Administrer gruppe</StyledHeaderH1>
      <StyledHeaderH2>Endre navn</StyledHeaderH2>
      <Form
        initialValues={{
          groupName: "test"
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
            <StyledButton type="submit">Endre</StyledButton>
          </form>
        )}
      />
    </StyledWrapper>
  );
};
