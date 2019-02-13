import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Ingredients } from "./Ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./Recipes/Recipes";

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
  padding: 15px;
  background-color: #fff;
`;

const StyledNav = styled.nav``;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
`;

const StyledLi = styled.li`
  margin-right: 5px;
`;

const StyledLink = styled(Link)`
  &:visited,
  &:link {
    color: inherit;
    text-decoration: none;
  }
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
`;

const AppRouter = () => (
  <Router>
    <div>
      <GlobalStyle />

      <StyledWrapper>
        <nav>
          <StyledUl>
            <StyledLi>
              <StyledLink to="/">Oppskrifter</StyledLink>
            </StyledLi>
            <StyledLi>
              <StyledLink to="/ingredients/">Ingredienser</StyledLink>
            </StyledLi>
          </StyledUl>
        </nav>
        <Route path="/" exact component={Recipes} />
        <Route path="/receipt/:id" exact component={Recipes} />
        <Route path="/ingredients/" component={Ingredients} />
      </StyledWrapper>
    </div>
  </Router>
);

export default AppRouter;
