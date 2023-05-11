import { atom } from "recoil";
// import { DB_CONNECTION_NAME_STORE } from "../constants";

export const languageState = atom( {
  key: 'languageState',
  default: 'SAN',
} );