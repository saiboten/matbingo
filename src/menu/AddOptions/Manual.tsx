import React, { useContext } from "react";
import { Form, Field } from "react-final-form";
import { firebase } from "../../firebase/firebase";
import styled from "styled-components";
import {
  StyledActionButtonWithMargins,
  StyledSecondaryActionButtonWithMargins
} from "../../components/StyledActionButton";
import { StyledInputLabel } from "../../components/StyledInputLabel";
import { StyledBack, StyledCheck } from "../../components/StyledSvgIcons";
import { UserDataContext } from "../../context/UserDataContext";

const StyledWrapper = styled.div`
  margin-top: 2rem;
`;

const StyledButtons = styled.div``;

const StyledInput = styled.input`
  padding: 10px;
`;

const StyledFieldSet = styled.fieldset`
  margin-bottom: 1rem;
  outline: none;
  border: none;
`;

interface Props {
  date: Date;
  back: () => void;
}

const storeSelectedRecipe = (
  date: Date,
  description: string,
  group: string
) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      description,
      group
    });
};

export const Manual = ({ date, back }: Props) => {
  const userData = useContext(UserDataContext).userdata;

  const onSubmit = (data: any) => {
    const { description } = data;

    storeSelectedRecipe(date, description, userData.group);
    back();
  };

  return (
    <StyledWrapper>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <StyledButtons>
              <StyledSecondaryActionButtonWithMargins onClick={back}>
                <StyledBack />
              </StyledSecondaryActionButtonWithMargins>
              <StyledActionButtonWithMargins type="submit">
                <StyledCheck />
              </StyledActionButtonWithMargins>
            </StyledButtons>
            <StyledFieldSet>
              <StyledInputLabel>Hva skjer denne dagen?</StyledInputLabel>
              <Field name="description" component="input" type="text">
                {({ input }: { input: any }) => (
                  <StyledInput
                    autoComplete="off"
                    placeholder="Hva skjer?"
                    {...input}
                  />
                )}
              </Field>
            </StyledFieldSet>
          </form>
        )}
      />
    </StyledWrapper>
  );
};
