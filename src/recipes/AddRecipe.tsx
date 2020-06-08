import React, { useState, useContext } from "react";
import { Field, Form } from "react-final-form";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { StyledError } from "../components/StyledError";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledInput } from "../components/StyledInput";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledButton } from "../components/StyledButton";
import Creatable from "react-select/creatable";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { SelectWrapper } from "../components/StyledSelectWrapper";
import { StyledTextArea } from "../components/StyledTextArea";
import { createRatings } from "../components/StyledRatings";
import { StyledRatingContainer } from "../components/StyledRatingContainer";
import { Redirect } from "react-router";
import { UserDataContext } from "../context/UserDataContext";
import { StyledWrapper } from "../components/StyledWrapper";
import { useIngredients } from "../hooks/useIngredients";
import { StyledLocalLoaderCentered } from "../components/StyledLocalLoader";
import Checkbox from "@material-ui/core/Checkbox";

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
  rating: string | undefined;
}

const onSubmit = (values: any, form: any, setDetailsId: any, group: string) => {
  if (!values.ingredients) {
    values.ingredients = [];
  }

  const createThese = values.ingredients
    .filter((el: any) => el.__isNew__)
    .map((el: any) => el.label);

  values.ingredients = values.ingredients.filter(
    (el: any) => typeof el.__isNew__ === "undefined"
  );

  const db = firebase.firestore();

  const createPromises: any = createThese.map((ingredientToBeCreated: string) =>
    db.collection("ingredients").add({
      name: ingredientToBeCreated,
      group,
    })
  );

  Promise.all(createPromises).then((newDocs: any) => {
    const newIds = newDocs.map((el: any) => el.id);

    db.collection("recipes")
      .add({
        ...values,
        ingredients: values.ingredients
          .map((el: Option) => el.value)
          .concat(newIds),
        lastTimeSelected: new Date(),
        rating: parseInt(values.rating, 10),
        group,
      })
      .then((docRef) => {
        setDetailsId(docRef.id);
      });

    form.reset();
  });
};

const validate = (values: any) => {
  let errors: RecipeErrors = {
    name: undefined,
    description: undefined,
    rating: undefined,
  };

  if (!values.name) {
    errors.name = "Oppskriften må ha et navn";
  }

  if (!values.rating) {
    errors.rating = "Du må oppgi en rating";
  }

  return errors;
};

interface Option {
  label: string;
  value: string;
}

const ReactSelectAdapter = ({ input, ...rest }: any) => {
  return <Creatable {...input} {...rest} />;
};

export function AddRecipe() {
  const [detailsId, setDetailsId] = useState("");
  const userData = useContext(UserDataContext).userdata;
  const [ingredientsLoading, ingredients] = useIngredients();

  if (detailsId !== "") {
    return <Redirect to={`/recipes/${detailsId}`} push />;
  }

  if (ingredientsLoading) {
    return (
      <StyledWrapper backgroundColor="white">
        <StyledLocalLoaderCentered />
      </StyledWrapper>
    );
  }

  return (
    <StyledWrapper backgroundColor="white">
      <Form
        onSubmit={(values, form) =>
          onSubmit(values, form, setDetailsId, userData.group)
        }
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <React.Fragment>
            <StyledHeaderH1>Legg til oppskrift</StyledHeaderH1>
            <StyledForm
              onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) =>
                handleSubmit(event)
              }
            >
              <StyledFieldSet>
                <Field name="name" component="input" type="text">
                  {({ input, meta }: { input: any; meta: any }) => (
                    <>
                      <StyledInputLabel>Oppskrift</StyledInputLabel>

                      <StyledInputWrapper>
                        {meta.error && meta.touched && (
                          <StyledError>{meta.error}</StyledError>
                        )}
                        <StyledInput
                          autoComplete="off"
                          placeholder="Navn på oppskrift"
                          {...input}
                        />
                      </StyledInputWrapper>
                    </>
                  )}
                </Field>
              </StyledFieldSet>
              <StyledFieldSet wide>
                <Field name="description" component="input" type="text">
                  {({ input, meta }: { input: any; meta: any }) => (
                    <>
                      <StyledInputLabel>Beskrivelse</StyledInputLabel>
                      <StyledInputWrapper>
                        {meta.error && meta.touched && (
                          <StyledError>{meta.error}</StyledError>
                        )}
                        <StyledTextArea
                          autoComplete="off"
                          placeholder="Beskrivelse"
                          {...input}
                        />
                      </StyledInputWrapper>
                    </>
                  )}
                </Field>
              </StyledFieldSet>
              <label>Legg til ingredienser</label>
              <SelectWrapper>
                <Field
                  name="ingredients"
                  component={ReactSelectAdapter}
                  isMulti
                  options={ingredients.map((el) => ({
                    label: el.name,
                    value: el.id,
                  }))}
                />
              </SelectWrapper>
              <label>Frekvens</label>
              <StyledRatingContainer>{createRatings()}</StyledRatingContainer>
              <div>
                <StyledInputLabel>
                  <Field name="weekdays" value="monday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "monday"} {...input} />
                    )}
                  </Field>
                  Mandag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="tuesday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "tuesday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Tirsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="wednesday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "wednesday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Onsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="thursday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "thursday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Torsdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="friday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "friday"} {...input} />
                    )}
                  </Field>
                  Fredag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="saturday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "saturday"}
                        {...input}
                      />
                    )}
                  </Field>
                  Lørdag
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="weekdays" value="sunday" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "sunday"} {...input} />
                    )}
                  </Field>
                  Søndag
                </StyledInputLabel>
              </div>
              <div>
                <label style={{ display: "block" }}>Type rett</label>
                <StyledInputLabel>
                  <Field name="recipetype" value="meat" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "meat"} {...input} />
                    )}
                  </Field>
                  Kjøtt
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="recipetype" value="fish" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "fish"} {...input} />
                    )}
                  </Field>
                  Fisk
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="recipetype" value="vegetarian" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox
                        checked={input.value === "vegetarian"}
                        {...input}
                      />
                    )}
                  </Field>
                  Vegetar
                </StyledInputLabel>
                <StyledInputLabel>
                  <Field name="recipetype" value="other" type="checkbox">
                    {({ input }: any) => (
                      <Checkbox checked={input.value === "other"} {...input} />
                    )}
                  </Field>
                  Annet
                </StyledInputLabel>
              </div>
              <StyledButton type="submit" disabled={pristine || submitting}>
                Legg til
              </StyledButton>
            </StyledForm>
          </React.Fragment>
        )}
      />
    </StyledWrapper>
  );
}
