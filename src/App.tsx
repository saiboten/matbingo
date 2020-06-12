import React, { useEffect, useReducer, useContext } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { Ingredients } from "./ingredients/Ingredients";
import { createGlobalStyle } from "styled-components";
import { Recipes } from "./recipes/Recipes";
import { ShoppingList } from "./shoppinglist/ShoppingList";
import { EditRecipeDetails } from "./recipes/EditRecipeDetails";
import { ShoppingListContext } from "./context/ShoppingListContext";
import { Week } from "./menu/Week";
import { firebase } from "./firebase/firebase";
import { StyledLoader } from "./components/StyledLoader";
import { Login } from "./login/Login";
import { UserContext } from "./context/UserContext";
import { Nav } from "./components/Nav";
import { UserDataContext } from "./context/UserDataContext";
import { GroupDataContext } from "./context/GroupDataContext";
import { JoinGroupRouter } from "./group/JoinOrCreateGroup";
import { Settings } from "./settings/Settings";
import { Providers } from "./Providers";
import { AddRecipe } from "./recipes/AddRecipe";
import { ListRecipesAndRedirect } from "./recipes/ListRecipesAndRedirect";
import { AdminGroup } from "./settings/AdminGroup";
import { Library } from "./library/Library";

const GlobalStyle = createGlobalStyle`
  *,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: inherit;
}

a:link, a:visited {
  color: black;
}

html {
    // This defines what 1 rem is
    background-color: #f5f5f5;
    font-size: 62.5%; // 1 rem == 10px
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
        <Providers>
          <AppRouter />
        </Providers>
      </>
    </Router>
  );
};

interface State {
  shoppingListLoading: boolean;
  userdataLoaded: boolean;
  loggedIn: boolean;
  loggedInStateClarified: boolean;
}

const initialState: State = {
  userdataLoaded: false,
  shoppingListLoading: true,
  loggedIn: false,
  loggedInStateClarified: false,
};

function reducer(state: State, action: any) {
  switch (action.type) {
    case "loggedInStateClarified":
      return {
        ...state,
        loggedInStateClarified: true,
      };
    case "userLoggedIn":
      return {
        ...state,
        loggedIn: true,
      };
    case "userLoggedOut":
      return {
        ...state,
        loggedIn: false,
      };
    case "userdataLoaded":
      return {
        ...state,
        userdataLoaded: true,
      };
    case "shoppingListLoaded":
      return {
        ...state,
        shoppingListLoading: false,
      };
    default:
      throw new Error();
  }
}

const AppRouter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { setUser } = useContext(UserContext);
  const { userdata, setUserdata } = useContext(UserDataContext);
  const { setGroupdata } = useContext(GroupDataContext);
  const { setIngredients, setGroup, setId } = useContext(ShoppingListContext);

  useEffect(() => {
    let unsubUserData = () => {};
    let unsubGroupData = () => {};
    let unsubShoppingList = () => {};

    const db = firebase.firestore();

    const subscribeToShoppingList = (groupId: string) => {
      unsubGroupData = db
        .collection("shoppingLists")
        .where("group", "==", groupId)
        .onSnapshot(async (querySnapshot) => {
          if (querySnapshot.empty) {
            return db
              .collection("shoppingLists")
              .add({ group: groupId, ingredients: [] });
          }
          dispatch({ type: "shoppingListLoaded" });
          const doc = querySnapshot.docs[0];
          const { group, ingredients } = doc.data();
          setId(doc.id);
          setGroup(group);
          setIngredients(ingredients);
        });
    };

    let unsubAuthChange = firebase.auth().onAuthStateChanged((user: any) => {
      dispatch({ type: "loggedInStateClarified" });
      if (user) {
        setUser(user);
        dispatch({ type: "userLoggedIn" });

        unsubUserData = db
          .collection("userdata")
          .doc(user.uid)
          .onSnapshot((querySnapshot) => {
            const userdata: any = querySnapshot.data() || { group: "" };

            setUserdata(userdata);
            dispatch({ type: "userdataLoaded" });

            if (userdata.group) {
              subscribeToShoppingList(userdata.group);
              unsubGroupData = db
                .collection("groups")
                .doc(userdata.group)
                .onSnapshot((querySnapshot) => {
                  const groupData: any = querySnapshot.data();

                  setGroupdata({
                    id: querySnapshot.id,
                    ...groupData,
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
      unsubShoppingList();
    };
  }, [
    setGroupdata,
    setId,
    setGroup,
    setIngredients,
    setUser,
    setUserdata,
    userdata.group,
  ]);

  if (!state.loggedInStateClarified) {
    return <StyledLoader />;
  }

  if (!state.loggedIn) {
    return <Login />;
  }

  if (state.userdataLoaded && !userdata.group) {
    return (
      <>
        <Nav />
        <JoinGroupRouter />
      </>
    );
  }

  if (!state.userdataLoaded) {
    return <StyledLoader />;
  }

  return (
    <div>
      <Nav />
      <main>
        <Route path="/" exact component={Week} />
        <Route path="/library" exact component={Library} />
        <Route path="/admin" exact component={AdminGroup} />
        <Route path="/recipes" exact component={Recipes} />
        <Route path="/find-recipes" exact component={ListRecipesAndRedirect} />
        <Route path="/add-recipe" exact component={AddRecipe} />
        <Route path="/recipe-feedback/:feedback" exact component={Recipes} />
        <Route path="/recipes/:id" exact component={EditRecipeDetails} />
        <Route path="/ingredients/" component={Ingredients} />
        <Route path="/shopping-list" component={ShoppingList} />
        <Route path="/login/" component={Login} />
        <Route path="/settings/" component={Settings} />
      </main>
    </div>
  );
};

export default App;
