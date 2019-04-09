import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Ingredients } from "./ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./recipes/Recipes";
import { RecipeContext, RecipeContextState } from "./context/RecipeContext";
import { EditRecipeDetails } from "./recipes/EditRecipeDetails";
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
import { JoinGroupRouter } from "./group/JoinOrCreateGroup";

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

interface State {
  recipesLoading: boolean;
  ingredientsLoading: boolean;
  userdataLoaded: boolean;
  loggedIn: boolean;
  loggedInStateClarified: boolean;
}

const initialState: State = {
  recipesLoading: true,
  ingredientsLoading: true,
  userdataLoaded: false,
  loggedIn: false,
  loggedInStateClarified: false
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case "loggedInStateClarified":
      return {
        ...state,
        loggedInStateClarified: true
      };
    case "userLoggedIn":
      return {
        ...state,
        loggedIn: true
      };
    case "userLoggedOut":
      return {
        ...state,
        loggedIn: false
      };
    case "userdataLoaded":
      return {
        ...state,
        userdataLoaded: true
      };
    case "recipesLoaded":
      return {
        ...state,
        recipesLoading: false
      };
    case "ingredientsLoaded":
      return {
        ...state,
        ingredientsLoading: false
      };
    default:
      throw new Error();
  }
}

const AppRouter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

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

  useEffect(
    () => {
      let unsubUserData = () => {};
      let unsubRecipes = () => {};
      let unsubIngredients = () => {};
      let unsubGroupData = () => {};

      let unsubAuthChange = firebase.auth().onAuthStateChanged((user: any) => {
        dispatch({ type: "loggedInStateClarified" });
        if (user) {
          setUser(user);
          dispatch({ type: "userLoggedIn" });
          const db = firebase.firestore();

          unsubUserData = db
            .collection("userdata")
            .doc(user.uid)
            .onSnapshot(querySnapshot => {
              const userdata: any = querySnapshot.data() || { group: "" };

              setUserdata(userdata);
              dispatch({ type: "userdataLoaded" });
              if (userdata.group) {
                unsubRecipes = db
                  .collection("recipes")
                  .where("group", "==", userdata.group)
                  .onSnapshot(querySnapshot => {
                    dispatch({ type: "recipesLoaded" });
                    recipesContextValue.setRecipes(
                      querySnapshot.docs.map((doc: any) => ({
                        id: doc.id,
                        ...doc.data()
                      }))
                    );
                  });
              }

              unsubIngredients = db
                .collection("ingredients")
                .where("group", "==", userdata.group)
                .onSnapshot(querySnapshot => {
                  dispatch({ type: "ingredientsLoaded" });
                  ingredientsContextValue.setIngredients(
                    querySnapshot.docs.map((doc: any) => ({
                      id: doc.id,
                      ...doc.data()
                    }))
                  );
                });

              if (userdata.group) {
                unsubGroupData = db
                  .collection("groups")
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
          dispatch({ type: "userLoggedOut" });
        }
      });

      return () => {
        unsubUserData();
        unsubAuthChange();
        unsubGroupData();
        unsubRecipes();
        unsubIngredients();
      };
    },
    [userdata.group]
  );

  if (!state.loggedInStateClarified) {
    return <StyledLoader />;
  }

  if (!state.loggedIn) {
    return <Login />;
  }

  if (state.userdataLoaded && !userdata.group) {
    return (
      <UserContext.Provider value={userContextValue}>
        <JoinGroupRouter />
      </UserContext.Provider>
    );
  }

  if (
    state.ingredientsLoading ||
    state.recipesLoading ||
    !state.userdataLoaded
  ) {
    return <StyledLoader />;
  }

  return (
    <div>
      <RecipeContext.Provider value={recipesContextValue}>
        <IngredientsContext.Provider value={ingredientsContextValue}>
          <UserContext.Provider value={userContextValue}>
            <UserDataContext.Provider value={userDataContextValue}>
              <GroupDataContext.Provider value={groupDataContextValue}>
                <Nav setLoggedIn={() => dispatch({ type: "userLoggedOut" })} />
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
