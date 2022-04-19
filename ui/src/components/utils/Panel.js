import React from "react";
import { Alert, AlertTitle, Box, CircularProgress, Paper, Stack, Toolbar, Typography } from "@mui/material";

const Panel = ( { title, toolbarActions,
  children, actionsLeft, actionsRight,
  loading, error, onRefresh, titleVarient = "dense",
  sx } ) => {

  const Titlebar = ( { title, toolbarActions, onRefresh, titleVarient } ) => {
    return ( title || toolbarActions || onRefresh ) ?
      <Toolbar sx={{ backgroundColor: 'primary.100', borderRadius: 1 }} variant={titleVarient}>
        {typeof title === 'string' ? <Typography variant="h6" sx={{ flexGrow: 1 }}> {title} </Typography>
          : <Box sx={{ flexGrow: 1 }}>{title}</Box>}
        <Stack direction='row' spacing={1}>
          {toolbarActions}
        </Stack>
      </Toolbar >
      : null
  }

  const LoadingPanel = () => (
    <Box sx={{ border: 1, borderRadius: 1, borderColor: "grey.900" }}>
      <Titlebar {...{ title, toolbarActions, onRefresh, titleVarient }} />

      <Paper sx={{ p: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Paper>
    </Box>
  )

  const ErrorPanel = ( { error, sx } ) => (
    <Box sx={{ border: 1, borderRadius: 1, borderColor: "grey.900", ...sx }}>
      <Titlebar {...{ title, toolbarActions, onRefresh, titleVarient }} />

      <Paper sx={{ p: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert severity="warning" variant="outlined">
          <AlertTitle>Error :(</AlertTitle>
          <Typography variant="body2">{error?.message}</Typography>
          {error?.networkError?.result?.errors?.length > 0 &&
            <Typography variant="body2">
              {error.networkError.result.errors.map( ( err, index ) => (
                <li severity="warning" variant="outlined" key={`err-${index}`}>
                  {err.message}
                </li>
              ) )}
            </Typography>}
        </Alert>
      </Paper>
    </Box>
  )

  if ( loading ) return <LoadingPanel />
  if ( error ) return <ErrorPanel {...{ error }} />

  return (
    <React.Suspense fallback={<LoadingPanel />}>
      <Box sx={{ border: 1, borderRadius: 1, borderColor: "grey.900", ...sx }}>

        <Titlebar {...{ title, toolbarActions, onRefresh, titleVarient }} />

        <Paper sx={{ p: 2, }}>
          {children}

          {( actionsLeft || actionsRight ) &&
            <Stack
              sx={{ pt: 1, mt: 2, borderTop: 1, borderColor: "grey.400" }}
              direction="row"
              spacing={2}
            // justifyContent="flex-end"
            >
              {( actionsLeft || actionsRight ) &&
                <Box sx={{ flexGrow: 1 }}>
                  {actionsLeft}
                </Box>
              }
              {actionsRight &&
                <Box >
                  {actionsRight}
                </Box>
              }

            </Stack>
          }

        </Paper>
      </Box>
    </React.Suspense>
  )


}

export default Panel