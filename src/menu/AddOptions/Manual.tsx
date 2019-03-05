import React from "react";
import { Form, Field } from "react-final-form";
import { firebase } from "../../firebase/firebase";

import {
  StyledActionButton,
  StyledActionButtonWithMargins
} from "../../components/StyledActionButton";

interface Props {
  date: Date;
  back: () => void;
}

const storeSelectedRecipe = (date: Date, description: string) => {
  firebase
    .firestore()
    .collection("days")
    .add({
      date,
      description
    });
};

export const Manual = ({ date, back }: Props) => {
  const onSubmit = ({ description }: any) => {
    storeSelectedRecipe(date, description);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, pristine, invalid }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Legg inn fritekstfelt</label>
              <Field
                name="description"
                component="input"
                placeholder="Hva skjer?"
              />
              <button type="submit" disabled={pristine || invalid}>
                Submit
              </button>
            </div>
          </form>
        )}
      />
      <StyledActionButtonWithMargins onClick={back}>
        Tilbake
      </StyledActionButtonWithMargins>
    </>
  );
};
