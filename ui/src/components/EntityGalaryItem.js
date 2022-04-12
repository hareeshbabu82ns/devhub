import * as React from 'react'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'

const DEFAULT_IMG = 'https://picsum.photos/300/250'

export default function EntityGalaryItem( { item, onSelect } ) {
  return (
    <ImageListItem>
      <img
        src={`${DEFAULT_IMG}?random=${item.id}`}
        srcSet={`${DEFAULT_IMG}?random=${item.id}`}
        alt={item.text}
        loading="lazy"
      />
      <ImageListItemBar
        title={item.text}
        subtitle={item.type}
        onClick={onSelect}
        actionIcon={
          <IconButton
            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
            aria-label={`info about ${item.text}`}
          >
            <InfoIcon />
          </IconButton>
        }
      />
    </ImageListItem>
  )
}