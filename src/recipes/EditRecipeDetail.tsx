import React, { useContext, useEffect, useState } from "react";
import SelectBase from "react-select";
import { RecipeContext } from "../context/RecipeContext";
import { RouteComponentProps, Redirect } from "react-router";
import { RecipeType, Ingredient } from "../types";
import { firebase } from "../firebase/firebase";
import { StyledHeaderH1 } from "../components/StyledHeaderH1";
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
import { StyledTextArea } from "../components/StyledTextArea";
import { Option } from "react-select/lib/filters";
import { StyledLoader } from "../components/StyledLoader";
import { StyledDeleteIcon } from "../components/StyledDeleteIcon";
import { StyledRatingContainer } from "../components/StyledRatingContainer";
import { createRatings } from "../components/StyledRatings";
import { StyledWrapper } from "../components/StyledWrapper";

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {}

const onSubmit = (documentId: string, values: any, form: any) => {
  const db = firebase.firestore();
  const recipes = values.recipes ? values.recipes : [];

  db.collection("recipes")
    .doc(documentId)
    .update({
      ...values,
      rating: parseInt(values.rating, 10),
      ingredients: recipes.map((el: Option) => el.value)
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

const ReactSelectAdapter = ({ input, ...rest }: any) => {
  return <SelectBase {...input} {...rest} />;
};

export const EditRecipeDetails = ({
  match: {
    params: { id }
  }
}: Props) => {
  const recipes = useContext(RecipeContext);
  const ingredients = useContext(IngredientsContext);

  const [nextPage, setNextPage] = useState("");

  useEffect(() => {
    const db = firebase.firestore();
    db.collection("recipes")
      .get()
      .then(querySnapshot => {
        recipes.setRecipes(
          querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
      });

    db.collection("ingredients")
      .get()
      .then(querySnapshot => {
        ingredients.setIngredients(
          querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        );
      });

    return () => {};
  }, []);

  if (ingredients.ingredients.length == 0) {
    return <StyledLoader />;
  }

  const recipeDetails: RecipeType = recipes.recipes.find(
    recipe => recipe.id === id
  ) || {
    name: "",
    description: "",
    id: "",
    ingredients: [],
    weekdays: [],
    lastTimeSelected: new Date(),
    rating: 1
  };

  const receipeIngredients = recipeDetails.ingredients.map(ingredientId => {
    const foundIngredient = ingredients.ingredients.find(
      (el: Ingredient) => el.id === ingredientId
    );

    if (!foundIngredient) {
      return null;
    }

    return {
      label: foundIngredient.name,
      value: ingredientId
    };
  });

  if (nextPage !== "") {
    return <Redirect push to={nextPage} />;
  }

  return (
    <StyledWrapper>
      <StyledHeaderH1>{recipeDetails.name}</StyledHeaderH1>

      <Form
        initialValues={{
          ...recipeDetails
        }}
        onSubmit={(values, form) => onSubmit(recipeDetails.id, values, form)}
        validate={validate}
        render={({ handleSubmit, submitting, pristine, reset }) => (
          <React.Fragment>
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
              <label>Rating</label>
              <StyledRatingContainer>{createRatings()}</StyledRatingContainer>
              <label>Legg til ingredienser</label>
              <IngredientsContext.Consumer>
                {({ ingredients }) => (
                  <SelectWrapper>
                    <Field
                      name="recipes"
                      component={ReactSelectAdapter}
                      isMulti
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

              <StyledButton type="submit">Oppdater</StyledButton>
            </StyledForm>
            <StyledActionButton
              onClick={() => deleteItem(recipeDetails.id, setNextPage)}
            >
              <StyledDeleteIcon color="white" />
            </StyledActionButton>
          </React.Fragment>
        )}
      />
    </StyledWrapper>
  );
};
