import React from 'react'
import { useRecoilValue } from 'recoil'
import {
  Container,
  Image,
  Menu,
} from 'semantic-ui-react'

import { Link } from 'react-router-dom'
import settings from '../state/settings'

const NavBar = () => {
  const settingsData = useRecoilValue(settings)
  return (
    <Menu fixed='top' inverted={settingsData.inverted}>
      <Container fluid>
        <Menu.Item as={Link} to={'/'} header>
          <Image size='mini' src='/logo192.png' style={{ marginRight: '1.0em' }} />
        Aadhyaathma Kendram
        </Menu.Item>
        <Menu.Item as={Link} to={'/gods'}>Gods</Menu.Item>
        <Menu.Item as={Link} to={'/authors'}>Authors</Menu.Item>

        <Menu.Menu position='right'>
          <Menu.Item as={Link} to={'/settings'} icon={'cog'} />
          <Menu.Item as={Link} to={'/login'} icon={'user'} />
        </Menu.Menu>
      </Container>
    </Menu>
  )
}
export default NavBar