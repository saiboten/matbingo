import React from "react";

export interface GroupData {
  id: string;
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
    id: "",
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
