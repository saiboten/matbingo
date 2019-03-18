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
import { GroupData, GroupDataContext } from "./context/GroupDataContext";
import { JoinOrCreateGroup } from "./group/JoinOrCreateGroup";

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
    font-family: Palatino,Palatino Linotype,Palatino LT STD,Book Antiqua,Georgia,serif;
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

  const [groupData, setGroupdata]: [GroupData, any] = useState({
    id: "",
    trelloApiKey: "",
    trelloApiToken: "",
    trelloList: "",
    owner: "",
    name: "",
    invites: [],
    members: []
  });

  const [userdata, setUserdata]: [UserData, any] = useState({
    group: ""
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

  const groupDataContextValue: GroupDataContext = {
    groupData,
    setGroupdata
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user: any) => {
      setLoggedInStateClarified(true);
      if (user) {
        setUser(user);
        setLoggedIn(true);
        const db = firebase.firestore();

        db.collection("userdata")
          .doc(user.uid)
          .onSnapshot(querySnapshot => {
            const userdata: any = querySnapshot.data() || { group: "" };

            setUserdata(userdata);

            db.collection("recipes")
              .where("group", "==", userdata.group)
              .onSnapshot(querySnapshot => {
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

            if (userdata.group) {
              db.collection("groups")
                .doc(userdata.group)
                .onSnapshot(querySnapshot => {
                  const groupData: any = querySnapshot.data();

                  groupDataContextValue.setGroupdata({
                    id: querySnapshot.id,
                    ...groupData
                  });
                });
            }
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

  if (!userdata.group) {
    return (
      <UserContext.Provider value={userContextValue}>
        <JoinOrCreateGroup />
      </UserContext.Provider>
    );
  }

  return (
    <div>
      <RecipeContext.Provider value={recipesContextValue}>
        <IngredientsContext.Provider value={ingredientsContextValue}>
          <UserContext.Provider value={userContextValue}>
            <UserDataContext.Provider value={userDataContextValue}>
              <GroupDataContext.Provider value={groupDataContextValue}>
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
              </GroupDataContext.Provider>
            </UserDataContext.Provider>
          </UserContext.Provider>
        </IngredientsContext.Provider>
      </RecipeContext.Provider>
    </div>
  );
};

export default App;
