import { atom } from "recoil";
// import { DB_CONNECTION_NAME_STORE } from "../constants";

export const environmentState = atom({
  key: 'environmentState',
  default: '',
  // default: localStorage.getItem(DB_CONNECTION_NAME_STORE),
});