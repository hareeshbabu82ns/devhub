import * as React from 'react'
import { Divider, ListItem, ListItemText } from '@mui/material'

export default function EntityTextListItem( { item, onSelect } ) {
  return (
    <>
      <ListItem>
        <ListItemText
          primary={<pre>{item.text}</pre>} />
      </ListItem>
      <Divider component="li" />
    </>
  )
}