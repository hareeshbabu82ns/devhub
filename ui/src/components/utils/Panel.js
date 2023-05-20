import React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { PANEL_RADIUS } from "../../constants";

const Panel = ({
  title,
  titleIcon,
  toolbarActions,
  children,
  actionsLeft,
  actionsRight,
  loading,
  error,
  onRefresh,
  titleVarient = "dense",
  sx,
}) => {
  const theme = useTheme();

  const Titlebar = ({
    title,
    toolbarActions,
    onRefresh,
    titleVarient,
    titleIcon,
  }) => {
    return title || toolbarActions || onRefresh ? (
      <Toolbar
        sx={{
          backgroundColor: theme.tones.primary[theme.isDark ? 95 : 60],
          borderRadius: 0,
          borderTopRightRadius: PANEL_RADIUS,
          borderTopLeftRadius: PANEL_RADIUS,
        }}
        variant={titleVarient}
      >
        <Stack sx={{ flexGrow: 1 }} direction="row" spacing={1}>
          {titleIcon}
          {typeof title === "string" ? (
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {" "}
              {title}{" "}
            </Typography>
          ) : (
            <Box sx={{ flexGrow: 1 }}>{title}</Box>
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {toolbarActions}
        </Stack>
      </Toolbar>
    ) : null;
  };

  const LoadingPanel = () => (
    <Box
      sx={{
        border: 1,
        borderRadius: 0,
        borderTopRightRadius: PANEL_RADIUS,
        borderTopLeftRadius: PANEL_RADIUS,
        borderColor: "grey.900",
      }}
    >
      <Titlebar
        {...{ title, toolbarActions, onRefresh, titleVarient, titleIcon }}
      />

      <Paper
        sx={{
          p: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    </Box>
  );

  const ErrorPanel = ({ error, sx }) => (
    <Box
      sx={{
        border: 1,
        borderRadius: 0,
        borderTopRightRadius: PANEL_RADIUS,
        borderTopLeftRadius: PANEL_RADIUS,
        borderColor: "grey.900",
        ...sx,
      }}
    >
      <Titlebar
        {...{ title, toolbarActions, onRefresh, titleVarient, titleIcon }}
      />

      <Paper
        sx={{
          p: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert severity="warning" variant="outlined">
          <AlertTitle>Error :(</AlertTitle>
          <Typography variant="body2">{error?.message}</Typography>
          {error?.networkError?.result?.errors?.length > 0 && (
            <Typography variant="body2">
              {error.networkError.result.errors.map((err, index) => (
                <li severity="warning" variant="outlined" key={`err-${index}`}>
                  {err.message}
                </li>
              ))}
            </Typography>
          )}
        </Alert>
      </Paper>
    </Box>
  );

  if (loading) return <LoadingPanel />;
  if (error) return <ErrorPanel {...{ error }} />;

  return (
    <React.Suspense fallback={<LoadingPanel />}>
      <Box
        sx={{
          border: 1,
          borderRadius: 0,
          borderTopRightRadius: PANEL_RADIUS,
          borderTopLeftRadius: PANEL_RADIUS,
          borderColor: "grey.900",
          ...sx,
        }}
      >
        <Titlebar
          {...{ title, toolbarActions, onRefresh, titleVarient, titleIcon }}
        />

        <Paper
          sx={{
            p: 2,
            borderRadius: 0,
            borderBottomRightRadius: PANEL_RADIUS,
            borderBottomLeftRadius: PANEL_RADIUS,
            background: theme.tones.secondary[99],
          }}
        >
          {children}

          {(actionsLeft || actionsRight) && (
            <Stack
              sx={{ pt: 1, mt: 2, borderTop: 1, borderColor: "grey.400" }}
              direction="row"
              spacing={2}
              // justifyContent="flex-end"
            >
              {(actionsLeft || actionsRight) && (
                <Box sx={{ flexGrow: 1 }}>{actionsLeft}</Box>
              )}
              {actionsRight && <Box>{actionsRight}</Box>}
            </Stack>
          )}
        </Paper>
      </Box>
    </React.Suspense>
  );
};

export default Panel;
