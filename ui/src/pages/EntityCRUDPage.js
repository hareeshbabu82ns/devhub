import React from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import {
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NewIcon from "@mui/icons-material/Add";
import Panel from "../components/utils/Panel";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  C_DEFAULT_IMAGE_THUMBNAIL,
  C_ENTITY_TYPE_SLOKAM,
  C_LANGUAGE_DEFAULT,
  C_LANGUAGE_TEXT_LIST,
} from "../constants";
import { useRecoilValueLoadable } from "recoil";
import { entityTypesState } from "../state/entityTypes";
import { FormInputDropdown } from "../components/FormInput/FormInputDropdown";
import { FormInputText } from "../components/FormInput/FormInputText";
import { FormInputTextArea } from "../components/FormInput/FormInputTextArea";
import { baseLanguagesState } from "../state/baseLanguages";
import _ from "lodash";
import { useSnackbar } from "notistack";
import EntitySelectFormInput from "../components/FormInput/EntitySelectFormInput";
import AudioPlayPauseButton from "../components/utils/AudioPlayPauseButton";

const QUERY_GET_ENTITIES_BY_ID = gql`
  query ($id: ID, $language: String) {
    entities(by: { id: { value: $id } }) {
      id
      type
      text(language: $language)
      imageThumbnail
      audio
      textData {
        language
        value
      }
      parents {
        id
        type
        text(language: $language)
      }
    }
  }
`;

const MUTATION_CREATE_ENTITY = gql`
  mutation ($data: EntityInput) {
    createEntity(withData: $data)
  }
`;
const MUTATION_UPDATE_ENTITY = gql`
  mutation ($id: ID!, $data: EntityInput) {
    updateEntity(id: $id, withData: $data)
  }
`;
const MUTATION_DELETE_ENTITY = gql`
  mutation ($id: ID!) {
    deleteEntity(id: $id)
  }
`;

const EntityCRUDPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, error, data, refetch } = useQuery(QUERY_GET_ENTITIES_BY_ID, {
    variables: {
      language: searchParams.get("language") || C_LANGUAGE_DEFAULT,
      id: params.id,
    },
  });

  const {
    loading: parentLoading,
    error: parentError,
    data: parentData,
  } = useQuery(QUERY_GET_ENTITIES_BY_ID, {
    variables: {
      language: searchParams.get("language") || C_LANGUAGE_DEFAULT,
      id: params.parent,
    },
  });

  const [
    createEntityMutation,
    { data: mCreData, error: mCreError, loading: mCreLoading },
  ] = useMutation(MUTATION_CREATE_ENTITY);
  const [
    updateEntityMutation,
    { data: mUpdData, error: mUpdError, loading: mUpdLoading },
  ] = useMutation(MUTATION_UPDATE_ENTITY);
  const [
    deleteEntityMutation,
    { data: mDelData, error: mDelError, loading: mDelLoading },
  ] = useMutation(MUTATION_DELETE_ENTITY);

  const onReset = async () => {
    await refetch();
  };

  const onDelete = async ({ id }) => {
    // console.log( 'onSubmit: ', data )

    try {
      if (id !== 0) {
        const res = await deleteEntityMutation({
          variables: {
            id: id,
          },
        });
        enqueueSnackbar("Entity Deleted");
        console.log(res);
        navigate(-1);
      }
    } catch (e) {
      enqueueSnackbar("Error Deleting Entity", { variant: "error" });
      console.log(e);
    }
  };

  const onSubmit = async (data) => {
    // console.log( 'onSubmit: ', data )

    try {
      if (data.id === 0) {
        const res = await createEntityMutation({
          variables: {
            data: transformToGQLInputData({ entityFormData: data }),
          },
        });
        enqueueSnackbar("Entity Saved");
        // console.log( res )
        navigate(`/entity/${res.data.createEntity}/edit${queryParams}`, {
          replace: true,
        });
      } else {
        const res = await updateEntityMutation({
          variables: {
            id: data.id,
            data: transformToGQLInputData({ entityFormData: data }),
          },
        });
        enqueueSnackbar("Entity Saved");
        console.log(res);
      }
    } catch (e) {
      enqueueSnackbar("Error Saving Entity", { variant: "error" });
      console.log(e);
    }
  };

  const prepareEntity = () => {
    const entity = data?.entities[0];
    const parentEntity = parentData?.entities[0];
    if (entity) return entity;
    if (parentEntity) {
      const parents = [{ ...parentEntity }];
      return { ...defaultEntity, parents };
    }
    return defaultEntity;
  };
  const prepareKey = () => {
    const entity = data?.entities[0];
    const parentEntity = parentData?.entities[0];
    if (entity) return `e-${entity.id}`;
    if (parentEntity) {
      return `pe-${parentEntity.id}`;
    }
    return `e-0`;
  };

  return (
    <EntityFormWrapper
      entity={prepareEntity()}
      parent={parentData?.entities[0]}
      key={prepareKey()}
      {...{
        loading: loading || parentLoading,
        error: params.id ? error : undefined,
        onReset,
        onSubmit,
        onDelete,
      }}
    />
  );
};
const defaultEntity = {
  id: 0,
  type: "",
  textData: [],
  imageThumbnail: C_DEFAULT_IMAGE_THUMBNAIL,
  audio: "",
  parents: [],
};

const transformToFormData = ({ entity }) => {
  return {
    id: entity.id,
    type: entity.type,
    imageThumbnail: entity.imageThumbnail,
    audio: entity.audio,
    parents: entity.parents,
    textData: C_LANGUAGE_TEXT_LIST?.map((l) => ({
      language: l,
      value: _.find(entity.textData, { language: l })?.value || "",
    })),
  };
};
const transformToGQLInputData = ({ entityFormData }) => {
  return {
    type: entityFormData.type,
    text: entityFormData.textData.filter((t) => !!t.value),
    imageThumbnail: entityFormData.imageThumbnail,
    audio: entityFormData.audio,
    parentIDs: entityFormData?.parents?.map((e) => ({
      type: e.type,
      entity: e.id,
    })),
  };
};
const EntityFormWrapper = ({
  entity,
  onSubmit,
  onDelete,
  loading,
  error,
  onReset,
}) => {
  // console.log( entity )
  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Entity Type is required"),
    textData: Yup.array()
      .of(
        Yup.object().shape({
          language: Yup.string(),
          value: Yup.string(),
        })
      )
      .min(1, "Required atleast 1 Text Data")
      .required("Entity Text Data is required"),
    imageThumbnail: Yup.string(),
    // audio: Yup.string(),
    parents: Yup.array().of(
      Yup.object().shape({
        type: Yup.string(),
        id: Yup.string(),
      })
    ),
  });
  const { search: queryParams } = useLocation();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const entityTypesLoadable = useRecoilValueLoadable(
    entityTypesState(searchParams.get("language") || C_LANGUAGE_DEFAULT)
  );
  const baseLanguagesLoadable = useRecoilValueLoadable(baseLanguagesState);

  const form = useForm({
    mode: "onSubmit",
    defaultValues: transformToFormData({ entity }),
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const actionsRight = (
    <Stack direction="row" spacing={2}>
      {!!entity.id && (
        <Button
          onClick={() => onDelete({ id: entity.id })}
          variant={"contained"}
          disabled={isSubmitting}
          color="error"
        >
          Delete
        </Button>
      )}
      <Button
        onClick={handleSubmit(onSubmit)}
        variant={"contained"}
        disabled={isSubmitting}
      >
        Submit
      </Button>
      <Button onClick={() => reset()} variant={"outlined"}>
        Reset
      </Button>
    </Stack>
  );

  const toolbarActions = (
    <React.Fragment>
      {!!entity.id && (
        <Tooltip title="Create Child">
          <IconButton
            onClick={() =>
              navigate(`/entity/create/${entity?.id}${queryParams}`)
            }
          >
            <NewIcon />
          </IconButton>
        </Tooltip>
      )}
    </React.Fragment>
  );

  return (
    <Panel
      title={`${
        entity.id
          ? entity.type === C_ENTITY_TYPE_SLOKAM
            ? "Slokam"
            : entity.text
          : "New Entity"
      }`}
      loading={
        loading ||
        entityTypesLoadable.state === "loading" ||
        baseLanguagesLoadable.state === "loading"
      }
      error={error}
      sx={{ border: 0, m: { xs: 0, lg: 2 } }}
      toolbarActions={toolbarActions}
      actionsRight={actionsRight}
    >
      <EntityForm
        entityTypes={entityTypesLoadable.contents}
        baseLanguages={baseLanguagesLoadable.contents}
        {...{ onSubmit, form }}
      />
    </Panel>
  );
};

const EntityForm = ({ form, onSubmit, entityTypes, baseLanguages }) => {
  // ref https://www.bezkoder.com/react-hook-form-material-ui-validation/
  const { formState, control, handleSubmit, setValue, getValues, watch } = form;
  const { errors, isSubmitting } = formState;

  const LanguageText = ({ languageText, index }) => {
    return (
      <Grid item xs={12}>
        <FormInputTextArea
          name={`textData[${index}].value`}
          control={control}
          label={`${
            _.find(baseLanguages, { iso: languageText })?.name || languageText
          } Text`}
        />
      </Grid>

      // <Grid item xs={12}>
      //   <FormInputText
      //     name={`textData[${index}].value`}
      //     control={control}
      //     label={`${_.find( baseLanguages, { 'iso': languageText } )?.name || languageText} Text`}
      //   />
      // </Grid>

      // <Grid container item xs={12} sx={{ m: 1 }} spacing={2}>
      //   <Grid item xs={12} sm={3}>
      //     <FormInputDropdown
      //       name={`textData[${index}].language`}
      //       control={control}
      //       // label="Entity Type"
      //       options={baseLanguages.map( e => ( { label: e.name, value: e.iso } ) )}
      //       disabled
      //     />
      //   </Grid>
      //   <Grid item xs={12} sm={9}>
      //     <FormInputText
      //       name={`textData[${index}].value`}
      //       control={control}
      //       label="Entity Text Value"
      //     />
      //   </Grid>
      // </Grid>
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <img
            src={watch("imageThumbnail")}
            alt="thumbnail"
            width={300}
            height={250}
            style={{ objectFit: "cover" }}
          />
        </Grid>
        <Grid container item xs={12} sm={8} spacing={1}>
          <Grid item xs={12} sm={12}>
            <FormInputDropdown
              name="type"
              control={control}
              label="Entity Type"
              options={entityTypes.map((e) => ({
                label: e.name,
                value: e.code,
              }))}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormInputText
              name="imageThumbnail"
              control={control}
              label="Thumbnail"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={1}>
              <Grid item xs={11}>
                <FormInputText
                  name="audio"
                  required={false}
                  control={control}
                  label="Audio"
                />
              </Grid>
              <Grid item xs={1}>
                <AudioPlayPauseButton url={watch("audio")} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <EntitySelectFormInput
              name="parents"
              label="Parents"
              defaultValue={getValues("parents")}
              onChange={(v) =>
                setValue(
                  "parents",
                  v.map((e) => ({ type: e.type, id: e.id, text: e.text }))
                )
              }
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} gap={2}>
          <Grid item xs={12}>
            <Typography>
              Text Data: (use <strong>$transliterateFrom=SLP1</strong> for auto
              translation)
            </Typography>
          </Grid>
          {C_LANGUAGE_TEXT_LIST.map((l, i) => (
            <LanguageText languageText={l} index={i} key={`ltext-${i}`} />
          ))}
        </Grid>
      </Grid>
    </form>
  );
};

export default EntityCRUDPage;
