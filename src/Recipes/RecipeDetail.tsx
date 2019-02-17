import React, { useContext, useEffect, useState } from "react";
import SelectBase from "react-select";
import { RecipeContext } from "../context/RecipeContext";
import { RouteComponentProps, Redirect } from "react-router";
import { RecipeType } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
import { primaryColor } from "../components/Constants";
import { StyledActionButton } from "../components/StyledActionButton";
import { Form, Field } from "react-final-form";
import { StyledForm } from "../components/StyledForm";
import { StyledFieldSet } from "../components/StyledFieldSet";
import { StyledInputLabel } from "../components/StyledInputLabel";
import { StyledInputWrapper } from "../components/StyledInputWrapper";
import { StyledError } from "../components/StyledError";
import { StyledInput } from "../components/StyledInput";
import { IngredientsContext } from "../context/IngredientsContext";
import { StyledButton } from "../components/StyledButton";
import { SelectWrapper } from "../components/StyledSelectWrapper";

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {}

const onSubmit = (documentId: string, values: any, form: any) => {
  const db = firebase.firestore();

  db.collection("recipes")
    .doc(documentId)
    .update({
      ...values
    });
};

interface RecipeErrors {
  name: string | undefined;
  description: string | undefined;
}

const validate = (values: any) => {
  let errors: RecipeErrors = { name: undefined, description: undefined };

  if (!values.name) {
    errors.name = "Oppskriften må ha et navn";
  }

  return errors;
};

function deleteItem(id: string, setNextPage: (nextPage: string) => void) {
  const db = firebase.firestore();
  db.collection("recipes")
    .doc(id)
    .delete();
  setNextPage("/");
}

export const RecipeDetails = ({
  match: {
    params: { id }
  }
}: Props) => {
  const recipes = useContext(RecipeContext);

  const [nextPage, setNextPage] = useState("");

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes").onSnapshot(querySnapshot => {
      recipes.setRecipes(
        querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => {};
  }, []);

  const handleChange = (selectedOptions: any) => {
    console.log(selectedOptions);
  };

  const recipeDetails: RecipeType = recipes.recipes.find(
    recipe => recipe.id === id
  ) || { name: "", description: "", id: "", ingredients: [], weekdays: [] };

  if (nextPage !== "") {
    return <Redirect push to={nextPage} />;
  }

  return (
    <div>
      <StyledHeaderH1>{recipeDetails.name}</StyledHeaderH1>

      <Form
        initialValues={{
          ...recipeDetails
        }}
        onSubmit={(values, form) => onSubmit(recipeDetails.id, values, form)}
        validate={validate}
        render={({ handleSubmit, submitting, pristine, reset }) => (
          <React.Fragment>
            <StyledHeaderH1>Legg til oppskrift</StyledHeaderH1>
            <StyledForm
              onSubmit={(event: React.SyntheticEvent<HTMLFormElement>) => {
                const promise = handleSubmit(event);
                if (promise) {
                  promise.then(reset);
                }
              }}
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
              <StyledFieldSet>
                <Field name="description" component="input" type="text">
                  {({ input, meta }: { input: any; meta: any }) => (
                    <>
                      <StyledInputLabel>Beskrivelse</StyledInputLabel>
                      <StyledInputWrapper>
                        {meta.error && meta.touched && (
                          <StyledError>{meta.error}</StyledError>
                        )}
                        <StyledInput
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
              <IngredientsContext.Consumer>
                {({ ingredients }) => (
                  <SelectWrapper>
                    <SelectBase
                      isMulti
                      onChange={handleChange}
                      options={ingredients.map(el => ({
                        label: el.name,
                        value: el.id
                      }))}
                    />
                  </SelectWrapper>
                )}
              </IngredientsContext.Consumer>

              <div>
                <div>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="monday"
                    />{" "}
                    Mandag
                  </StyledInputLabel>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="tuesday"
                    />{" "}
                    Tirsdag
                  </StyledInputLabel>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="wednesday"
                    />{" "}
                    Onsdag
                  </StyledInputLabel>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="thursday"
                    />{" "}
                    Torsdag
                  </StyledInputLabel>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="friday"
                    />{" "}
                    Fredag
                  </StyledInputLabel>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="saturday"
                    />{" "}
                    Lørdag
                  </StyledInputLabel>
                  <StyledInputLabel>
                    <Field
                      name="weekdays"
                      component="input"
                      type="checkbox"
                      value="sunday"
                    />{" "}
                    Søndag
                  </StyledInputLabel>
                </div>
              </div>

              <StyledButton type="submit" disabled={pristine || submitting}>
                Oppdater
              </StyledButton>
            </StyledForm>
          </React.Fragment>
        )}
      />

      <StyledActionButton
        onClick={() => deleteItem(recipeDetails.id, setNextPage)}
      >
        Slett oppskrift
      </StyledActionButton>
    </div>
  );
};
