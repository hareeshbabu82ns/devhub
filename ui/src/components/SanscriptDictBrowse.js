import React, { useEffect, useMemo, useState } from "react";
import { gql } from "@apollo/client";
import { useRecoilState } from "recoil";

import client from "../utils/GqlClient";

import { C_DICTIONARY_MAP, C_SANSCRIPT_SCHEME_MAP } from "../constants";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { sanscriptDictBrowseState } from "../state/sanscriptDict";
import { throttle } from "lodash";
import SimpleDictItemDlg from "./SimpleDictItemDlg";
import SanscriptDictResults from "./SanscriptDictResults";

const SanscriptDictBrowse = () => {
  const [sdict, setSansDict] = useRecoilState(sanscriptDictBrowseState);

  const [limit, setLimit] = useState(sdict.limit);
  const [offset, setOffset] = useState(sdict.offset);
  const [origin, setOrigin] = useState(sdict.origin);
  const [outputScheme, setOutputScheme] = useState(sdict.outputScheme);
  const [selectedItemId, setSelectedItemId] = useState(sdict.selectedItemId);

  const [total, setTotal] = useState(0);
  const [dictResult, setDictResult] = useState([]);

  const [openDetailDlg, setOpenDetailDlg] = React.useState(false);
  const [detailDlgItem, setDetailDlgItem] = React.useState(undefined);

  const dictBrowse = useMemo(
    () =>
      throttle(({ outputScheme, limit, offset, origin }, callback) => {
        if (!origin) {
          callback({ data: { total: 0, results: [] } });
          return;
        }
        client
          .query({
            query: QUERY_BROWSE_DICT,
            variables: {
              browseWith: {
                limit: Number(limit),
                offset: Number(offset),
                origin,
                outputScheme,
              },
            },
          })
          .then(({ data }) => callback({ data: data?.dictionaryBrowse }))
          .catch(console.log);
      }, 1000),
    []
  );

  useEffect(() => {
    dictBrowse(
      {
        limit,
        offset,
        origin,
        outputScheme,
      },
      ({ data }) => {
        setDictResult(data.results);
        setTotal(data.total);
        setOffset(data.total >= limit * offset ? offset : 0);
        setSansDict((state) => ({
          ...state,
          origin,
          limit,
          offset: data.total >= limit * offset ? offset : 0,
          outputScheme,
        }));
      }
    );
  }, [dictBrowse, setSansDict, limit, offset, origin, outputScheme]);

  const handleOffsetChange = (e) => {
    const val = Number(e.target.value || "0");
    setOffset(val);
    setSansDict((state) => ({
      ...state,
      offset: val,
    }));
  };

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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={5}>
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
            >
              {C_DICTIONARY_MAP.map((l) => (
                <MenuItem key={l.value} value={l.value}>
                  {l.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
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

        <Grid item xs={12} sm={6} lg={2}>
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

        <Grid item xs={12} sm={6} lg={2}>
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

const QUERY_BROWSE_DICT = gql`
  query browse($browseWith: DictionaryBrowseInput!) {
    dictionaryBrowse(browseWith: $browseWith) {
      total
      results {
        id
        key
        origin
      }
    }
  }
`;

export default SanscriptDictBrowse;
