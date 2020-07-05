import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  Container,
  Image,
  Menu, Dropdown, Sidebar,
} from 'semantic-ui-react'
import logo from '../sun_128.png';
import { Link } from 'react-router-dom'
import settings from '../state/settings'
import { baseTypes } from '../state/base_types'

const NavBar = () => {
  const settingsData = useRecoilValue(settings)
  const { language, meaningLanguage } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  const { languages } = useRecoilValue(baseTypes)
  const currentLang = languages.find((lang) => lang.id === language)
  const updateLanguage = (id) => {
    setSetting(oldSetting => ({ ...oldSetting, language: id }))
  }
  return (
    <Menu fluid vertical inverted={settingsData.inverted} style={{ height: '100%' }}>
      <Menu.Item as={Link} to={'/'} header>
        <Image size='mini' src={logo} style={{ marginRight: '1.0em' }} avatar />
        <span>Aadhyaathma Kendram</span>
      </Menu.Item>
      <Menu.Item as={Link} to={'/gods'}>Gods</Menu.Item>
      <Menu.Item as={Link} to={'/authors'}>Authors</Menu.Item>
      <Menu.Item as={Link} to={'/sanscript'}>Sanscript</Menu.Item>

      <Menu.Item as={Link} to={'/settings'} icon={'cog'} content='Settings' />
      <Menu.Item as={Link} to={'/login'} icon={'user'} content='Profile' />
    </Menu>
  )
}
export default NavBar