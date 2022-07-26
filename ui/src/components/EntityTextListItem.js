import * as React from 'react'
import { Divider, ListItem, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import _ from 'lodash'
// import DetailsIcon from '@mui/icons-material/NavigateNext'
import { useRecoilValue } from 'recoil'
import { contentFont } from '../state/contentFont'
import { Box } from '@mui/system'
import BookmarkIcon from '@mui/icons-material/Bookmark'

export default function EntityTextListItem( { item, onSelect } ) {
  const contentFontVal = useRecoilValue( contentFont )
  return (
    <>
      <ListItem
        onClick={onSelect}
      // secondaryAction={
      //   <IconButton edge='end' area-label='entity details'
      //     onClick={onSelect}>
      //     <DetailsIcon />
      //   </IconButton>
      // }
      >
        <Typography fontSize={contentFontVal.fontSize}
          letterSpacing={contentFontVal.letterSpacing}
          lineHeight={contentFontVal.lineHeight}>
          <ReactMarkdown
            children={_.get( item, 'text', `**no content**` )}
            remarkPlugins={[ remarkGfm ]} />
        </Typography>
        {item?.bookmarked &&
          <Box sx={{ position: 'absolute', right: 4, top: 4 }}>
            <BookmarkIcon />
          </Box>
        }
      </ListItem>
      <Divider component="li" />
    </>
  )
}