import * as React from "react";
import {
  ImageList,
  IconButton,
  List,
  useMediaQuery,
  Fab,
  Breadcrumbs,
  Link,
  Typography,
  Divider,
} from "@mui/material";
import BackIcon from "@mui/icons-material/NavigateBefore";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import NewIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/AccountTreeOutlined";
import NavBackIcon from "@mui/icons-material/NavigateBefore";
import ToTopIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSnackbar } from "notistack";
import { useQuery, gql, NetworkStatus } from "@apollo/client";
import EntityGalaryItem from "../components/EntityGalaryItem";
import Panel from "../components/utils/Panel";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { C_ENTITY_TYPE_SLOKAM, C_LANGUAGE_DEFAULT } from "../constants";
import EntityTextListItem from "../components/EntityTextListItem";
import _ from "lodash";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { entityTypesState } from "../state/entityTypes";
import { entityDetailState } from "../state/entityDetail";
import useScroll from "../utils/useScroll";
import { contentFont } from "../state/contentFont";

const QUERY_GET_ENTITY_CHILDREN = gql`
  query ($id: ID, $language: String) {
    entities(by: { id: { value: $id } }) {
      id
      type
      text(language: $language)
      childrenCount
      children {
        id
        type
        text(language: $language)
        imageThumbnail
        bookmarked
      }
      parents {
        id
        text(language: $language)
        type
        imageThumbnail
        parents {
          id
          text(language: $language)
          type
          imageThumbnail
          parents {
            id
            text(language: $language)
            type
            imageThumbnail
            parents {
              id
              text(language: $language)
              type
              imageThumbnail
            }
          }
        }
      }
    }
  }
`;

export default function EntityGalaryPage() {
  const mediaSmUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mediaMdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const mediaLgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const mediaXlUp = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const [executeScroll, elRef] = useScroll();
  const [scrollToTop, elTopRef] = useScroll();
  const contentFontVal = useRecoilValue(contentFont);

  const params = useParams();
  const [searchParams] = useSearchParams();
  const { search: queryParams } = useLocation();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const setEntityDetailDlg = useSetRecoilState(entityDetailState);

  const entityTypes = useRecoilValue(
    entityTypesState(searchParams.get("language") || C_LANGUAGE_DEFAULT)
  );

  const [refetching, setRefetching] = React.useState(false);
  const [entity, setEntity] = React.useState(undefined);
  const [children, setChildren] = React.useState([]);
  const [hasTextContents, setHasTextContents] = React.useState(false);

  const { loading, error, data, refetch, networkStatus } = useQuery(
    QUERY_GET_ENTITY_CHILDREN,
    {
      variables: {
        language: searchParams.get("language") || C_LANGUAGE_DEFAULT,
        id: params.id,
      },
    }
  );

  React.useEffect(executeScroll, [executeScroll]); // Runs after component mounts

  React.useEffect(() => {
    if (data?.entities[0]) {
      const { id, type, text, childrenCount, parents } = data.entities[0];
      setEntity({
        id,
        type,
        text,
        childrenCount,
        parents,
        typeData: _.find(entityTypes, { code: type }),
      });
      setChildren(
        data.entities[0].children.map((i) => ({
          ...i,
          typeData: _.find(entityTypes, { code: i.type }),
        }))
      );
      const index = data.entities[0].children.findIndex(
        (e) => e.type === C_ENTITY_TYPE_SLOKAM
      );
      setHasTextContents(index >= 0);
    } else {
      setEntity(undefined);
      setChildren([]);
      setHasTextContents(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  React.useEffect(() => {
    if (error) enqueueSnackbar("Error fetching Entities", { variant: "error" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const refetchData = async () => {
    setRefetching(true);
    try {
      await refetch();
    } catch (e) {
      enqueueSnackbar("Error fetching Entities", { variant: "error" });
    }
    setRefetching(false);
  };

  const toolbarActions = (
    <React.Fragment>
      <IconButton
        aria-label="Edit Entity"
        onClick={() => navigate(`/entity/${entity?.id}/edit${queryParams}`)}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        disabled={
          loading || networkStatus === NetworkStatus.refetch || refetching
        }
        onClick={() => navigate(`/entity/create/${entity?.id}${queryParams}`)}
      >
        <NewIcon />
      </IconButton>
      <IconButton
        disabled={
          loading || networkStatus === NetworkStatus.refetch || refetching
        }
        onClick={refetchData}
      >
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Panel
      title={entity ? `${entity.text}` : "Entity Children"}
      titleIcon={
        <IconButton size="small" onClick={() => navigate(-1)}>
          <BackIcon />
        </IconButton>
      }
      sx={{ border: 0, m: { xs: 0, lg: 2 } }}
      loading={loading || refetching}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}
    >
      {/* Ref Element to Scroll to Top */}
      <div ref={elTopRef}></div>

      {/* Parent Breadcrumbs */}
      {entity?.parents?.length > 0 && (
        <>
          <Breadcrumbs
            separator={<NavBackIcon fontSize="small" />}
            aria-label="to parent"
          >
            {mapEntityParents({ item: entity.parents[0], res: [] }).map(
              (p, i) => (
                <Link
                  underline="hover"
                  color="inherit"
                  onClick={() => navigate(`/entity/${p.id}${queryParams}`)}
                  key={p.id}
                >
                  <Typography
                    fontSize={contentFontVal.fontSize}
                    letterSpacing={contentFontVal.letterSpacing}
                    lineHeight={contentFontVal.lineHeight}
                  >
                    {i === 0 && <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />}{" "}
                    {p.text}
                  </Typography>
                </Link>
              )
            )}
          </Breadcrumbs>
          <Divider />
        </>
      )}

      {/* Children as Image List */}
      {children?.length > 0 && !hasTextContents && (
        <ImageList
          gap={20}
          cols={
            mediaXlUp ? 5 : mediaLgUp ? 4 : mediaMdUp ? 3 : mediaSmUp ? 2 : 1
          }
        >
          {children.map((item, i) => (
            <EntityGalaryItem
              item={item}
              key={item.id}
              onSelect={() => navigate(`/entity/${item.id}${queryParams}`)}
            />
          ))}
        </ImageList>
      )}

      {/* Children as Text Items */}
      {children?.length > 0 && hasTextContents && (
        <List sx={{ width: "100%" }}>
          {children.map((item, i) => (
            <div ref={item.bookmarked ? elRef : null} key={item.id}>
              <EntityTextListItem
                item={item}
                key={item.id}
                onSelect={() =>
                  setEntityDetailDlg((s) => ({
                    ...s,
                    drawerOpened: true,
                    entityId: item.id,
                  }))
                }
              />
            </div>
            // onSelect={() => navigate( `/entity/${item.id}/details${queryParams}` )} />
          ))}
        </List>
      )}

      <Fab
        color="secondary"
        aria-label="To Top"
        onClick={scrollToTop}
        sx={{ position: "fixed", bottom: 16, right: 24 }}
      >
        <ToTopIcon />
      </Fab>
    </Panel>
  );
}

function mapEntityParents({ item, res = [] }) {
  if (item.parents && item.parents.length > 0) {
    mapEntityParents({ item: item.parents[0], res });
  }
  res.push({ ...item });
  return res;
}
