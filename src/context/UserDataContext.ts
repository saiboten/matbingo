import React from "react";

export interface UserData {
  group: string;
}

export interface UserDataContext {
  userdata: UserData;
  setUserdata: any;
}

const initialState: UserDataContext = {
  userdata: {
    group: ""
  },
  setUserdata: () => {}
};

export const UserDataContext = React.createContext(initialState);
