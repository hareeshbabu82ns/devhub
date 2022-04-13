import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// import ListSubheader from '@mui/material/ListSubheader'
import AritmeticIcon from '@mui/icons-material/CalculateOutlined'
import DashIcon from '@mui/icons-material/DashboardOutlined'
import { Link, useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'

export const MainListItems = () => {
  const { search: queryParams } = useLocation()
  return (
    <div>
      <ListItem component={Link} to={`/${queryParams}`}>
        <ListItemIcon>
          <DashIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Dashboard</Typography>} />
      </ListItem>
      <ListItem component={Link} to={`/gods${queryParams}`}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Gods</Typography>} />
      </ListItem>
    </div>
  )
}

export const SecondaryListItems = () => {
  const { search: queryParams } = useLocation()
  return (
    <div>
      {/* <ListSubheader inset>Saved Searches</ListSubheader> */}
      <ListItem component={Link} to={`/editor${queryParams}`}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">GraphEditor</Typography>} />
      </ListItem>
    </div>
  )
}