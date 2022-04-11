import { gql, useQuery } from "@apollo/client"
import { Autocomplete, TextField } from "@mui/material"
import { Controller } from "react-hook-form"

const GET_ALL_OPERATION_NAMES = gql`
{
  getAllOperationNames
}
`
function OperationFormInput( { name, label, control, ...rest } ) {
  const { data, loading } = useQuery( GET_ALL_OPERATION_NAMES )

  return (
    <Controller
      name={name}
      control={control}
      render={( {
        field: { onChange, value },
        fieldState: { error },
        formState,
      } ) => (
        <Autocomplete
          freeSolo
          size="small"
          fullWidth
          value={value}
          disabled={loading || error}
          onChange={( event, newValue ) => {
            onChange( newValue || '' )
          }}
          inputValue={value}
          onInputChange={( event, newInputValue ) => {
            onChange( newInputValue || '' )
          }}
          options={data?.getAllOperationNames || []}
          renderInput={( params ) => <TextField {...rest} {...params}
            label={error ? 'Error' : label}
            error={!!error}
            variant="outlined"
            helperText={error ? error.message : null}
          />}
        />
      )}
    />
  )
}

export default OperationFormInput