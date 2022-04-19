import * as React from 'react'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
// import IconButton from '@mui/material/IconButton'
// import InfoIcon from '@mui/icons-material/Info'
import _ from 'lodash'

export default function EntityGalaryItem( { item, onSelect } ) {
  return (
    <ImageListItem onClick={onSelect}>
      <img
        src={item.imageThumbnail}
        srcSet={item.imageThumbnail}
        alt={item.text}
        loading="lazy"
      />
      <ImageListItemBar
        title={item.text}
        subtitle={_.get( item, 'typeData.name', item.type )}
        onClick={onSelect}
      // actionIcon={
      //   <IconButton
      //     sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
      //     aria-label={`info about ${item.text}`}
      //   >
      //     <InfoIcon />
      //   </IconButton>
      // }
      />
    </ImageListItem>
  )
}