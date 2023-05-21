import { gql, useQuery } from "@apollo/client";
import { Dialog, Typography } from "@mui/material";
import Panel from "./utils/Panel";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

function SimpleDictItemDlg(props) {
  const { onClose, open, selectedItem, outputScheme } = props;

  const handleClose = () => {
    onClose();
  };

  const { data, loading, error } = useQuery(QUERY_SEARCH_DICT_BY_ID, {
    variables: { id: selectedItem?.id || 0, outputScheme },
  });

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      scroll={"paper"}
      // fullScreen={true}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <Panel
        sx={{ border: 0 }}
        title={`${selectedItem?.key} from ${selectedItem?.origin}`}
        loading={loading}
        error={error}
      >
        {/* <pre>{JSON.stringify( data, null, 2 )}</pre> */}
        <Typography variant="h5">
          <ReactMarkdown
            children={data?.dictionarySearchById?.description}
            remarkPlugins={[remarkGfm]}
          />
        </Typography>
      </Panel>
    </Dialog>
  );
}

const QUERY_SEARCH_DICT_BY_ID = gql`
  query search($id: ID!, $outputScheme: SanscriptScheme) {
    dictionarySearchById(id: $id, outputScheme: $outputScheme) {
      id
      key
      origin
      description
    }
  }
`;

export default SimpleDictItemDlg;
