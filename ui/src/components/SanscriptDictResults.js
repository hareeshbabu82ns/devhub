import { ListItemButton, ListItemText, TablePagination } from "@mui/material";
import Panel from "./utils/Panel";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const SanscriptDictResults = ({
  total,
  offset,
  limit,
  setOffset,
  setLimit,
  dictResult,
  handleItemSelected,
  selectedItemId,
}) => {
  return (
    <Panel
      title={"Results"}
      sx={{ border: 0, mt: 2 }}
      toolbarActions={
        <TablePagination
          component="div"
          count={total}
          page={offset}
          onPageChange={(e, page) => setOffset(page)}
          rowsPerPage={limit}
          onRowsPerPageChange={(event) => {
            setLimit(parseInt(event.target.value, 10));
            setOffset(0);
          }}
          showFirstButton={true}
          showLastButton={true}
        />
      }
    >
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12 }}>
        {dictResult?.map((i) => (
          <DictionaryListItem
            key={i.id}
            item={i}
            onItemSelected={handleItemSelected}
            selectedItemId={selectedItemId}
          />
        ))}
      </Grid>
    </Panel>
  );
};

const DictionaryListItem = ({ item, onItemSelected, selectedItemId }) => {
  return (
    <Grid xs={4} sm={6} md={4} lg={3} xl={2}>
      <ListItemButton
        alignItems="flex-start"
        sx={{ border: 1, borderRadius: 1, mt: 1 }}
        onClick={() =>
          onItemSelected({ id: item.id, key: item.key, origin: item.origin })
        }
        selected={item.id === selectedItemId}
      >
        {/* <pre>{JSON.stringify( item, null, 2 )}</pre> */}
        <ListItemText primary={item.key} secondary={item.origin} />
      </ListItemButton>
    </Grid>
  );
};

export default SanscriptDictResults;
