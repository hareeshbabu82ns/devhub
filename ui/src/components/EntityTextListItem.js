import * as React from 'react'
import { Divider, ListItem, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import _ from 'lodash'

export default function EntityTextListItem( { item } ) {
  return (
    <>
      <ListItem>
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