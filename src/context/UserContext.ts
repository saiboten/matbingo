import React from "react";

export interface User {
  displayName: string;
  email: string;
  uid: string;
}

export interface UserContextState {
  user: User;
  setUser: any;
}

const initalState: UserContextState = {
  user: {
    displayName: "",
    email: "",
    uid: ""
  },
  setUser: () => ({})
};

export const UserContext = React.createContext(initalState);
