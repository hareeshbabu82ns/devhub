import { atom } from "recoil";

export const sanscriptDictState = atom({
  key: "sanscriptDictState",
  default: {
    drawerOpened: false,
    dictDetailsOpened: false,
    inputScheme: "SLP1",
    outputScheme: "TELUGU",
    inputText: "",
    limit: 25,
    offset: 0,
    origin: [],
    fuzzySearch: false,
    searchOnlyKeys: false,
    caseInsensitive: false,
    startsWith: true,
    endsWith: false,
    selectedItemId: "",
    dictBrowseSearch: "search",
  },
});

export const sanscriptDictBrowseState = atom({
  key: "sanscriptDictBrowseState",
  default: {
    drawerOpened: false,
    dictDetailsOpened: false,
    inputScheme: "SLP1",
    outputScheme: "TELUGU",
    limit: 25,
    offset: 0,
    origin: "",
    dictBrowseSearch: "search",
    selectedItemId: "",
  },
});
