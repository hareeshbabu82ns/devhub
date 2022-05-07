import * as React from 'react'
import { Divider, IconButton, ListItem, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import _ from 'lodash'
import DetailsIcon from '@mui/icons-material/NavigateNext'

export default function EntityTextListItem( { item, onSelect } ) {
  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge='end' area-label='entity details'
            onClick={onSelect}>
            <DetailsIcon />
          </IconButton>
        }>
        <Typography variant='h5'>
          <ReactMarkdown
            children={_.get( item, 'text', `**no content**` )}
            remarkPlugins={[ remarkGfm ]} />
        </Typography>

      </ListItem>
      <Divider component="li" />
    </>
  )
}