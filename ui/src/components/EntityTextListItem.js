import * as React from 'react'
import { Divider, IconButton, ListItem, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import _ from 'lodash'
import DetailsIcon from '@mui/icons-material/NavigateNext'
import { useRecoilValue } from 'recoil'
import { contentFont } from '../state/contentFont'

export default function EntityTextListItem( { item, onSelect } ) {
  const contentFontVal = useRecoilValue( contentFont )
  return (
    <>
      <ListItem
        secondaryAction={
          <IconButton edge='end' area-label='entity details'
            onClick={onSelect}>
            <DetailsIcon />
          </IconButton>
        }>
        <Typography fontSize={contentFontVal.fontSize}
          letterSpacing={contentFontVal.letterSpacing}
          lineHeight={contentFontVal.lineHeight}>
          <ReactMarkdown
            children={_.get( item, 'text', `**no content**` )}
            remarkPlugins={[ remarkGfm ]} />
        </Typography>

      </ListItem>
      <Divider component="li" />
    </>
  )
}