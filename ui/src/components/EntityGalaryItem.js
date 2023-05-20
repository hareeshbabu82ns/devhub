import * as React from "react";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
// import IconButton from '@mui/material/IconButton'
// import InfoIcon from '@mui/icons-material/Info'
import _ from "lodash";
import { useTheme } from "@mui/material";

export default function EntityGalaryItem({ item, onSelect }) {
  const theme = useTheme();

  const buildText = (item) => {
    if (item.parents && item.parents.length > 0) {
      return `${item.text} - ${buildText(item.parents[0])}`;
    } else {
      return item.text;
    }
  };
  return (
    <ImageListItem onClick={onSelect}>
      <img
        src={item.imageThumbnail}
        srcSet={item.imageThumbnail}
        alt={item.text}
        loading="lazy"
      />
      <ImageListItemBar
        title={buildText(item)}
        subtitle={_.get(item, "typeData.name", item.type)}
        onClick={onSelect}
        sx={{
          // background: theme.palette.background.paper,
          "& .MuiImageListItemBar-title": {
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          },
          "& .MuiImageListItemBar-subtitle": {
            color: "white",
          },
        }}
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
  );
}
