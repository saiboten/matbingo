import React from "react";

export interface UserData {
  trelloApiKey: string;
  trelloApiToken: string;
  trelloList: string;
}

export interface UserDataContext {
  userdata: UserData;
  setUserdata: any;
}

const initialState: UserDataContext = {
  userdata: {
    trelloApiKey: "",
    trelloApiToken: "",
    trelloList: ""
  },
  setUserdata: () => {}
};

export const UserDataContext = React.createContext(initialState);
