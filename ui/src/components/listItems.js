import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// import ListSubheader from '@mui/material/ListSubheader'
import AritmeticIcon from '@mui/icons-material/CalculateOutlined'
import DashIcon from '@mui/icons-material/DashboardOutlined'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

export const mainListItems = (
  <div>
    <ListItem component={Link} to="/">
      <ListItemIcon>
        <DashIcon />
      </ListItemIcon>
      <ListItemText primary={<Typography color="text.primary">Dashboard</Typography>} />
    </ListItem>
    <ListItem component={Link} to="/gods">
      <ListItemIcon>
        <AritmeticIcon />
      </ListItemIcon>
      <ListItemText primary={<Typography color="text.primary">Gods</Typography>} />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    {/* <ListSubheader inset>Saved Searches</ListSubheader> */}
  </div>
);