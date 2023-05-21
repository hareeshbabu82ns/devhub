import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
import { C_DICTIONARY_MAP, C_SANSCRIPT_SCHEME_MAP } from "../constants";
import { useRecoilState } from "recoil";
import { sanscriptDictState } from "../state/sanscriptDict";
import { gql } from "@apollo/client";
import client from "../utils/GqlClient";
import SimpleDictItemDlg from "./SimpleDictItemDlg";
import SanscriptDictResults from "./SanscriptDictResults";

const QUERY_SEARCH_DICT = gql`
  query search($searchWith: DictionarySearchInput!) {
    dictionarySearch(searchWith: $searchWith) {
      total
      results {
        id
        key
        origin
      }
    }
  }
`;

const C_SEARCH_SWITCH_MAP = [
  { label: "Fuzzy Search", value: "fuzzySearch" },
  { label: "Search Only Keys", value: "searchOnlyKeys" },
  { label: "Ignore Case", value: "caseInsensitive" },
  { label: "Starts With", value: "startsWith" },
  { label: "Ends With", value: "endsWith" },
];

const switchToMap = (switchesValue) => {
  return {
    fuzzySearch: !!switchesValue?.includes("fuzzySearch"),
    searchOnlyKeys: !!switchesValue?.includes("searchOnlyKeys"),
    caseInsensitive: !!switchesValue?.includes("caseInsensitive"),
    startsWith: !!switchesValue?.includes("startsWith"),
    endsWith: !!switchesValue?.includes("endsWith"),
  };
};
const switchFromState = (state) => {
  const val = [];
  if (state?.fuzzySearch) val.push("fuzzySearch");
  if (state?.searchOnlyKeys) val.push("searchOnlyKeys");
  if (state?.caseInsensitive) val.push("caseInsensitive");
  if (state?.startsWith) val.push("startsWith");
  if (state?.endsWith) val.push("endsWith");
  return val;
};

const SanscriptDictSearch = () => {
  const [sdict, setSansDict] = useRecoilState(sanscriptDictState);

  const [inputText, setInputText] = useState(sdict.inputText);
  const [limit, setLimit] = useState(sdict.limit);
  const [offset, setOffset] = useState(sdict.offset);
  const [origin, setOrigin] = useState(sdict.origin);
  const [inputScheme, setInputScheme] = useState(sdict.inputScheme);
  const [outputScheme, setOutputScheme] = useState(sdict.outputScheme);
  const [switches, setSwitches] = useState(switchFromState(sdict));
  const [selectedItemId, setSelectedItemId] = useState(sdict.selectedItemId);

  const [total, setTotal] = useState(0);
  const [dictResult, setDictResult] = useState([]);

  const [openDetailDlg, setOpenDetailDlg] = React.useState(false);
  const [detailDlgItem, setDetailDlgItem] = React.useState(undefined);

  const handleOffsetChange = (e) => {
    const val = Number(e.target.value || "0");
    setOffset(val);
    setSansDict((state) => ({
      ...state,
      offset: val,
    }));
  };

  const dictSearch = useMemo(
    () =>
      throttle(
        (
          {
            inputText,
            inputScheme,
            outputScheme,
            limit,
            offset,
            origin,
            switches,
          },
          callback
        ) => {
          if (!inputText) {
            callback({ inputText, data: { total: 0, results: [] } });
            return;
          }
          client
            .query({
              query: QUERY_SEARCH_DICT,
              variables: {
                searchWith: {
                  search: inputText,
                  limit: Number(limit),
                  offset: Number(offset),
                  origin,
                  searchScheme: inputScheme,
                  outputScheme,
                  ...switchToMap(switches),
                },
              },
            })
            .then(({ data }) =>
              callback({ inputText, data: data?.dictionarySearch })
            )
            .catch(console.log);
        },
        1000
      ),
    []
  );

  useEffect(() => {
    dictSearch(
      {
        inputText,
        limit,
        offset,
        origin,
        inputScheme,
        outputScheme,
        switches,
      },
      ({ inputText, data }) => {
        setDictResult(data.results);
        setTotal(data.total);
        setOffset(data.total >= limit * offset ? offset : 0);
        setSansDict((state) => ({
          ...state,
          data,
          inputText,
          origin,
          limit,
          offset: data.total >= limit * offset ? offset : 0,
          inputScheme,
          outputScheme,
          ...switchToMap(switches),
        }));
      }
    );
  }, [
    dictSearch,
    setSansDict,
    inputText,
    limit,
    offset,
    origin,
    inputScheme,
    outputScheme,
    switches,
  ]);

  const handleItemSelected = (item) => {
    setSelectedItemId(item.id);
    setOpenDetailDlg(true);
    setDetailDlgItem(item);
    setSansDict((state) => ({
      ...state,
      selectedItemId: item.id,
    }));
  };

  return (
    <>
      <Grid container spacing={1}>
        {/* Query Form */}
        <Grid item container spacing={2}>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12} sm={6} lg={8}>
              <TextField
                id="inputText"
                label="Search Text"
                placeholder="Search Text"
                variant="outlined"
                size="small"
                fullWidth
                value={inputText}
                onChange={(e) => setInputText(e.target?.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3} lg={2}>
              <FormControl fullWidth>
                <InputLabel id="limitLbl">Limit</InputLabel>
                <Select
                  id="limit"
                  labelId="limitLbl"
                  value={limit}
                  label="Limit"
                  onChange={(e) => setLimit(Number(e.target.value))}
                  size="small"
                  fullWidth
                >
                  {[10, 25, 50, 100].map((l) => (
                    <MenuItem key={l} value={l}>
                      {l}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3} lg={2}>
              <TextField
                id="offset"
                label="Page Offset"
                placeholder="Page Offset"
                value={offset}
                size="small"
                inputProps={{
                  min: 0,
                  max: Math.round(total / limit),
                  type: "number",
                }}
                onChange={handleOffsetChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={6} spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="switchLbl">Search Switches</InputLabel>
                <Select
                  id="switch"
                  labelId="switchLbl"
                  value={switches}
                  label="Search Switches"
                  onChange={(e) => setSwitches(e.target.value)}
                  size="small"
                  fullWidth
                  multiple
                >
                  {C_SEARCH_SWITCH_MAP.map((l) => (
                    <MenuItem key={l.value} value={l.value}>
                      {l.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="originLbl">Dictionary</InputLabel>
                <Select
                  id="origin"
                  labelId="originLbl"
                  value={origin}
                  label="Dictionary"
                  onChange={(e) => setOrigin(e.target.value)}
                  size="small"
                  fullWidth
                  multiple
                >
                  {C_DICTIONARY_MAP.map((l) => (
                    <MenuItem key={l.value} value={l.value}>
                      {l.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={6} spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="inputSchemeLbl">Input Scheme</InputLabel>
                <Select
                  id="inputScheme"
                  labelId="inputSchemeLbl"
                  value={inputScheme}
                  label="Input Scheme"
                  onChange={(e) => setInputScheme(e.target.value)}
                  size="small"
                  fullWidth
                >
                  {C_SANSCRIPT_SCHEME_MAP.map((l) => (
                    <MenuItem key={l.value} value={l.value}>
                      {l.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="outputSchemeLbl">Output Scheme</InputLabel>
                <Select
                  id="outputScheme"
                  labelId="outputSchemeLbl"
                  value={outputScheme}
                  label="Output Scheme"
                  onChange={(e) => setOutputScheme(e.target.value)}
                  size="small"
                  fullWidth
                >
                  {C_SANSCRIPT_SCHEME_MAP.map((l) => (
                    <MenuItem key={l.value} value={l.value}>
                      {l.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        {/* Query From End */}

        {/* Results */}
        <Grid item xs={12}>
          <SanscriptDictResults
            total={total}
            offset={offset}
            limit={limit}
            setOffset={setOffset}
            setLimit={setLimit}
            dictResult={dictResult}
            handleItemSelected={handleItemSelected}
            selectedItemId={selectedItemId}
          />
        </Grid>
        {/* Results End */}
      </Grid>

      <SimpleDictItemDlg
        open={openDetailDlg}
        onClose={() => setOpenDetailDlg(false)}
        selectedItem={detailDlgItem}
        outputScheme={outputScheme}
      />
    </>
  );
};

export default SanscriptDictSearch;
