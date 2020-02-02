import React from "react";

export interface UserData {
  group: string;
  wunderlistAccessToken?: string;
}

export interface UserDataContext {
  userdata: UserData;
  setUserdata: any;
}

const initialState: UserDataContext = {
  userdata: {
    group: "",
    wunderlistAccessToken: undefined
  },
  setUserdata: () => {}
};

export const UserDataContext = React.createContext(initialState);
