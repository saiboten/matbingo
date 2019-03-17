import React from "react";

export interface GroupData {
  trelloApiKey: string;
  trelloApiToken: string;
  trelloList: string;
  name: string;
  owner: string;
  invites: string[];
  members: string[];
}

export interface GroupDataContext {
  groupData: GroupData;
  setGroupdata: any;
}

const initialState: GroupDataContext = {
  groupData: {
    trelloApiKey: "",
    trelloApiToken: "",
    trelloList: "",
    name: "",
    owner: "",
    invites: [],
    members: []
  },
  setGroupdata: () => {}
};

export const GroupDataContext = React.createContext(initialState);
