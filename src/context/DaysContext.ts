import React from "react";

interface Day {
  date: Date;
  description?: string;
  recipe?: string;
}

export interface DayContextState {
  days: Day[];
  setDays: any;
}

const initialState: DayContextState = {
  days: [],
  setDays: () => ({})
};

export const DaysContext = React.createContext(initialState);
