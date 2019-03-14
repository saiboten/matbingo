import React from "react";

export interface GroupData {
  trelloApiKey: string;
  trelloApiToken: string;
  trelloList: string;
}

export interface GroupDataContext {
  groupData: GroupData;
  setGroupdata: any;
}

const initialState: GroupDataContext = {
  groupData: {
    trelloApiKey: "",
    trelloApiToken: "",
    trelloList: ""
  },
  setGroupdata: () => {}
};

export const GroupDataContext = React.createContext(initialState);
