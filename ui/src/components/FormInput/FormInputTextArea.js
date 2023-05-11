import React from "react"
import { Controller } from "react-hook-form"
import TextField from "@mui/material/TextareaAutosize"

export const FormInputTextArea = ( { name, control, label, rules, ...rest } ) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={( {
        field: { onChange, value },
        fieldState: { error },
        formState,
      } ) => (
        <TextField
          onChange={onChange}
          value={value}
          placeholder={label}
          variant="outlined"
          style={{
            width: '100%', borderRadius: '5px',
            backgroundColor: '#0000', color: '#fff',
            fontSize: '16px',
          }}
          minRows={5}
          {...rest}
        />
      )}
    />
  )
}