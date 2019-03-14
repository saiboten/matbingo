import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Ingredients } from "./ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./recipes/Recipes";
import { RecipeContext, RecipeContextState } from "./context/RecipeContext";
import { EditRecipeDetails } from "./recipes/EditRecipeDetail";
import {
  IngredientsContext,
  IngredientsContextState
} from "./context/IngredientsContext";
import { secondaryColor } from "./components/Constants";
import { Week } from "./menu/Week";
import { firebase } from "./firebase/firebase";
import { StyledLoader } from "./components/StyledLoader";
import { Login } from "./login/Login";
import { UserContext, UserContextState, User } from "./context/UserContext";
import { Nav } from "./components/Nav";
import { UserData, UserDataContext } from "./context/UserDataContext";

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
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [ingredientsLoading, setIngredientsLoading] = useState(true);
  const [ingredients, setIngredients] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInStateClarified, setLoggedInStateClarified] = useState(false);
  const [user, setUser]: [User, any] = useState({
    displayName: "",
    email: "",
    uid: ""
  });

  const [userdata, setUserdata]: [UserData, any] = useState({
    trelloApiKey: "",
    trelloApiToken: "",
    trelloList: ""
  });

  const userContextValue: UserContextState = {
    user,
    setUser
  };

  const userDataContextValue: UserDataContext = {
    userdata,
    setUserdata
  };

  const recipesContextValue: RecipeContextState = {
    recipes,
    setRecipes
  };

  const ingredientsContextValue: IngredientsContextState = {
    ingredients,
    setIngredients
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      setLoggedInStateClarified(true);
      if (user) {
        setUser(user);
        setLoggedIn(true);
        const db = firebase.firestore();
        db.collection("recipes").onSnapshot(querySnapshot => {
          setRecipesLoading(false);
          recipesContextValue.setRecipes(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });

        db.collection("ingredients").onSnapshot(querySnapshot => {
          setIngredientsLoading(false);
          ingredientsContextValue.setIngredients(
            querySnapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data()
            }))
          );
        });
        db.collection("userdata")
          .doc(user.uid)
          .onSnapshot(querySnapshot => {
            setUserdata(querySnapshot.data());
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

  if (ingredientsLoading || recipesLoading) {
    return <StyledLoader />;
  }

  return (
    <div>
      <RecipeContext.Provider value={recipesContextValue}>
        <IngredientsContext.Provider value={ingredientsContextValue}>
          <UserContext.Provider value={userContextValue}>
            <UserDataContext.Provider value={userDataContextValue}>
              <Nav setLoggedIn={setLoggedIn} />
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
            </UserDataContext.Provider>
          </UserContext.Provider>
        </IngredientsContext.Provider>
      </RecipeContext.Provider>
    </div>
  );
};

export default App;
