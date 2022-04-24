import * as React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import AritmeticIcon from '@mui/icons-material/CalculateOutlined'
import DashIcon from '@mui/icons-material/DashboardOutlined'
import DictionaryIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation } from 'react-router-dom'
import { Typography } from '@mui/material'
import { useSetRecoilState } from 'recoil'
import { drawerState } from './Drawer'

export const MainListItems = () => {
  const setDrawerState = useSetRecoilState( drawerState )
  const { search: queryParams } = useLocation()
  return (
    <div>
      <ListItem component={Link} to={`/${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <DashIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Dashboard</Typography>} />
      </ListItem>
      <ListItem component={Link} to={`/gods${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Gods</Typography>} />
      </ListItem>
    </div>
  )
}

export const SecondaryListItems = () => {
  const setDrawerState = useSetRecoilState( drawerState )
  const { search: queryParams } = useLocation()
  return (
    <>
      <ListSubheader>Entities</ListSubheader>
      <ListItem component={Link} to={`/entity/create${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Create</Typography>} />
      </ListItem>
      <ListSubheader>Uploaders</ListSubheader>
      <ListItem component={Link} to={`/uploaders/sthotram${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Sthotram</Typography>} />
      </ListItem>
      {/* <ListSubheader inset>Saved Searches</ListSubheader> */}
      <ListSubheader>Extras</ListSubheader>
      {/* <ListItem component={Link} to={`/transliterate${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Transliterate</Typography>} />
      </ListItem> */}
      <ListItem component={Link} to={`/sans-dict${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <DictionaryIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">Sanscript Dictionary</Typography>} />
      </ListItem>
      <ListItem component={Link} to={`/editor${queryParams}`} onClick={() => setDrawerState( false )}>
        <ListItemIcon>
          <AritmeticIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography color="text.primary">GraphEditor</Typography>} />
      </ListItem>
    </>
  )
}