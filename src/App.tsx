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
  margin: 0 auto;
  border: 1px solid #bbbbbb;
  padding: 0 15px;
`;

const Index = () => <h1>Velkommen hjem</h1>;

const AppRouter = () => (
  <Router>
    <div>
      <GlobalStyle />
      <nav>
        <ul>
          <li>
            <Link to="/">Hjem</Link>
          </li>
          <li>
            <Link to="/recipes/">Oppskrifter</Link>
          </li>
          <li>
            <Link to="/ingredients/">Ingredienser</Link>
          </li>
        </ul>
      </nav>
      <StyledWrapper>
        <Route path="/" exact component={Index} />
        <Route path="/ingredients/" component={Ingredients} />
        <Route path="/recipes/" component={Recipes} />
      </StyledWrapper>
    </div>
  </Router>
);

export default AppRouter;
