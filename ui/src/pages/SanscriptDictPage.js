import { IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Panel from "../components/utils/Panel";
import CloseIcon from "@mui/icons-material/Close";
import DictSearchIcon from "@mui/icons-material/Search";
import DictBrowseIcon from "@mui/icons-material/AutoStories";
import React from "react";
import { useRecoilState } from "recoil";
import { sanscriptDictState } from "../state/sanscriptDict";
import SanscriptDictBrowse from "../components/SanscriptDictBrowse";
import SanscriptDictSearch from "../components/SanscriptDictSearch";

const SanscriptDictPage = ({ onClose }) => {
  const [sdict, setSansDict] = useRecoilState(sanscriptDictState);

  const handleDictChange = (event, dictBrowseSearch) => {
    if (dictBrowseSearch !== null) {
      setSansDict((state) => ({ ...state, dictBrowseSearch }));
    }
  };

  const toolbarActions = (
    <React.Fragment>
      <ToggleButtonGroup
        size="small"
        exclusive
        aria-label="Dictionary Search or Browse"
        value={sdict.dictBrowseSearch}
        onChange={handleDictChange}
      >
        <ToggleButton value="search" key="search">
          <DictSearchIcon />
        </ToggleButton>
        <ToggleButton value="browse" key="browse">
          <DictBrowseIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      {onClose && (
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </React.Fragment>
  );

  return (
    <Panel
      title={"Sanscript Dict"}
      sx={{ border: 0, m: { xs: 0, lg: 2 } }}
      toolbarActions={toolbarActions}
    >
      {sdict.dictBrowseSearch === "browse" && <SanscriptDictBrowse />}
      {sdict.dictBrowseSearch === "search" && <SanscriptDictSearch />}
    </Panel>
  );
};

export default SanscriptDictPage;
