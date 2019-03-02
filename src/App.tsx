import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Ingredients } from "./ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./recipes/Recipes";
import { RecipeContext, RecipeContextState } from "./context/RecipeContext";
import { EditRecipeDetails } from "./recipes/EditRecipeDetail";
import {
  IngredientsContext,
  IngredientsContextState
} from "./context/IngredientsContext";
import { primaryColor, minBreakPoint } from "./components/Constants";
import { Week } from "./menu/Week";
import { StyledNotification } from "./components/StyledNotification";

const GlobalStyle = createGlobalStyle`
  *,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

html {
    // This defines what 1 rem is
    font-size: 62.5%; // 1 rem == 10px
    background-color: #d4dce0;
}

body {
    box-sizing: border-box;
    font-size: 1.6rem;
}

ul {
  list-style-type: none;
}

li {
  text-decoration: none;
}

::selection {

}
`;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
  background-color: ${primaryColor};
  align-items: center;
  font-size: 20px;

  @media screen and (max-width: ${minBreakPoint}px) {
    flex-direction: column;
  }
`;

const StyledLeftItemLi = styled.li`
  margin-right: auto;

  @media screen and (max-width: ${minBreakPoint}px) {
    margin-right: 0;
  }
`;

const StyledLi = styled.li`
  margin-right: 5px;
  padding: 20px 0;
  border: 2px solid transparent;

  @media screen and (max-width: ${minBreakPoint}px) {
    padding: 5px 0;
  }

  &:hover {
    border: 2px solid grey;
  }
`;

const StyledLink = styled(Link)`
  &:visited,
  &:link {
    color: #f3f3f3;
    text-decoration: none;
  }
  padding: 10px;
`;

const AppRouter = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const contextValue: RecipeContextState = {
    recipes,
    setRecipes
  };

  const ingredientsContextValue: IngredientsContextState = {
    ingredients,
    setIngredients
  };

  return (
    <Router>
      <div>
        <RecipeContext.Provider value={contextValue}>
          <IngredientsContext.Provider value={ingredientsContextValue}>
            <GlobalStyle />
            <nav>
              <StyledUl>
                <StyledLeftItemLi>
                  <StyledLink to="/">Food-Eureka!</StyledLink>
                </StyledLeftItemLi>
                <StyledLi>
                  <StyledLink to="/recipes">Oppskrifter</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledLink to="/ingredients/">Ingredienser</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledLink to="/">Ukesmeny</StyledLink>
                </StyledLi>
              </StyledUl>
            </nav>
            <div>
              <Route path="/" exact component={Week} />
              <Route path="/recipes" exact component={Recipes} />
              <Route
                path="/recipe-feedback/:feedback"
                exact
                component={Recipes}
              />
              <Route path="/recipes/:id" exact component={EditRecipeDetails} />
              <Route path="/ingredients/" component={Ingredients} />
            </div>
          </IngredientsContext.Provider>
        </RecipeContext.Provider>
      </div>
    </Router>
  );
};

export default AppRouter;
