import React, { useState, useEffect } from "react";
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
import {
  primaryColor,
  minBreakPoint,
  secondaryColor
} from "./components/Constants";
import { Week } from "./menu/Week";
import { firebase } from "./firebase/firebase";
import { StyledLoader } from "./components/StyledLoader";
import { Login } from "./login/Login";
import { StyledSecondaryActionButton } from "./components/StyledActionButton";
import { UserContext, UserContextState, User } from "./context/UserContext";
import { StyledHamburger } from "./components/StyledHamburger";
import { DayContextState, DaysContext } from "./context/DaysContext";

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
    background-color: ${secondaryColor};
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

interface NavProps {
  active: boolean;
}

const StyledUl = styled.ul<NavProps>`
  list-style-type: none;
  display: flex;
  justify-content: flex-end;
  padding: 5px 0;
  background-color: ${primaryColor};
  align-items: center;
  font-size: 20px;
  transition: all 0.5s ease-in-out;
  z-index: 10;

  @media screen and (max-width: ${minBreakPoint}px) {
    display: ${props => (props.active ? "block" : "none")};

    position: fixed;
    transform: translateX(-100vw);
    width: 70%;
    height: 100vh;

    ${props =>
      props.active &&
      `
      transform: translateX(0);
    `}
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

const LogOut = (setLoggedIn: (val: boolean) => void) => {
  firebase
    .auth()
    .signOut()
    .then(function() {
      // Sign-out successful.
    })
    .catch(function(error) {
      // An error happened.
    });
  setLoggedIn(false);
};

const App = () => {
  return (
    <Router>
      <>
        <GlobalStyle />
        <AppRouter />
      </>
    </Router>
  );
};

const AppRouter = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [days, setDays] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInStateClarified, setLoggedInStateClarified] = useState(false);
  const [user, setUser]: [User, any] = useState({
    displayName: "",
    email: "",
    uid: ""
  });

  const userContextValue: UserContextState = {
    user,
    setUser
  };

  const recipesContextValue: RecipeContextState = {
    recipes,
    setRecipes
  };

  const ingredientsContextValue: IngredientsContextState = {
    ingredients,
    setIngredients
  };

  const dayContextValue: DayContextState = {
    days,
    setDays
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      setLoggedInStateClarified(true);
      if (user) {
        setUser(user);
        setLoggedIn(true);
        const db = firebase.firestore();
        db.collection("recipes").onSnapshot(querySnapshot => {
          recipesContextValue.setRecipes(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });

        db.collection("days").onSnapshot(querySnapshot => {
          dayContextValue.setDays(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });

        db.collection("ingredients").onSnapshot(querySnapshot => {
          ingredientsContextValue.setIngredients(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  if (!loggedInStateClarified) {
    return <StyledLoader />;
  }

  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div>
      <DaysContext.Provider value={dayContextValue}>
        <RecipeContext.Provider value={recipesContextValue}>
          <IngredientsContext.Provider value={ingredientsContextValue}>
            <UserContext.Provider value={userContextValue}>
              <nav>
                <StyledHamburger onClick={() => setMenuActive(!menuActive)} />
                <StyledUl active={menuActive}>
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
                  <StyledLi>
                    <StyledSecondaryActionButton
                      onClick={() => LogOut(setLoggedIn)}
                    >
                      Logg ut
                    </StyledSecondaryActionButton>
                  </StyledLi>
                </StyledUl>
              </nav>
              <main>
                <Route path="/" exact component={Week} />
                <Route path="/recipes" exact component={Recipes} />
                <Route
                  path="/recipe-feedback/:feedback"
                  exact
                  component={Recipes}
                />
                <Route
                  path="/recipes/:id"
                  exact
                  component={EditRecipeDetails}
                />
                <Route path="/ingredients/" component={Ingredients} />
                <Route path="/login/" component={Login} />
              </main>
            </UserContext.Provider>
          </IngredientsContext.Provider>
        </RecipeContext.Provider>
      </DaysContext.Provider>
    </div>
  );
};

export default App;
