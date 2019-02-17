import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Ingredients } from "./Ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./Recipes/Recipes";
import { RecipeContext, RecipeContextState } from "./context/RecipeContext";
import { RecipeDetails } from "./Recipes/RecipeDetail";
import {
  IngredientsContext,
  IngredientsContextState
} from "./context/IngredientsContext";
import { primaryColor } from "./components/Constants";
import { WeekMenu } from "./menu/WeekMenu";

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

const StyledWrapper = styled.div`
  max-width: 415px;
  margin: 20px auto;
  border: 1px solid #bbbbbb;
  padding: 0;
  background-color: #fff;
`;

const StyledContentWrapper = styled.div`
  padding: 15px;
`;

const StyledNav = styled.nav``;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
  background-color: ${primaryColor};
  align-items: center;
  font-size: 20px;
`;

const StyledLeftItemLi = styled.li`
  margin-right: auto;
`;

const StyledLi = styled.li`
  margin-right: 5px;
  padding: 20px 0;
  border: 2px solid transparent;

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
  /* background-color: #1859ea; */
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
                  <StyledLink to="/">Oppskrifter</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledLink to="/ingredients/">Ingredienser</StyledLink>
                </StyledLi>
                <StyledLi>
                  <StyledLink to="/menu/">Ukesmeny</StyledLink>
                </StyledLi>
              </StyledUl>
            </nav>
            <StyledWrapper>
              <StyledContentWrapper>
                <Route path="/" exact component={Recipes} />
                <Route path="/recipes/:id" exact component={RecipeDetails} />
                <Route path="/ingredients/" component={Ingredients} />
                <Route path="/menu/" component={WeekMenu} />
              </StyledContentWrapper>
            </StyledWrapper>
          </IngredientsContext.Provider>
        </RecipeContext.Provider>
      </div>
    </Router>
  );
};

export default AppRouter;
