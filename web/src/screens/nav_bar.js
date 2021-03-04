import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import {
  Container,
  Image,
  Menu, Dropdown, Checkbox
} from 'semantic-ui-react'
import logo from '../sun_128.png';
import { Link } from 'react-router-dom'
import settings from '../state/settings'
import { baseTypes } from '../state/base_types'
import { Media } from '../utils/media_context'

const NavBar = () => {
  // const settingsData = useRecoilValue(settings)
  const { inverted, language,
    meaningLanguage, appSideBarVisible } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  const { languages } = useRecoilValue(baseTypes)
  const currentLang = languages.find((lang) => lang.id === language)
  const meaningLang = languages.find((lang) => lang.id === meaningLanguage)
  const updateLanguage = (id) => {
    setSetting(oldSetting => ({ ...oldSetting, language: id }))
  }
  const updateMeaningLanguage = (id) => {
    setSetting(oldSetting => ({ ...oldSetting, meaningLanguage: id }))
  }
  const toggleSideBar = () => {
    setSetting(oldSetting => ({ ...oldSetting, appSideBarVisible: !oldSetting.appSideBarVisible }))
  }

  const LanguageDDLB = (<Dropdown item text={currentLang.iso}>
    <Dropdown.Menu>
      <Dropdown.Header content='Content' />
      <Dropdown.Divider />
      {languages.map(language => (
        <Dropdown.Item key={language.id} selected={currentLang.id == language.id}
          onClick={() => updateLanguage(language.id)}>{language.iso}</Dropdown.Item>))}
    </Dropdown.Menu>
  </Dropdown>)
  const MeaningLanguageDDLB = (<Dropdown item text={meaningLang.iso}>
    <Dropdown.Menu>
      <Dropdown.Header content='Meaning' />
      <Dropdown.Divider />
      {languages.map(language => (
        <Dropdown.Item key={language.id} selected={currentLang.id == language.id}
          onClick={() => updateMeaningLanguage(language.id)}>{language.iso}</Dropdown.Item>))}
    </Dropdown.Menu>
  </Dropdown>)

  return (
    <React.Fragment>
      <Media greaterThanOrEqual="computer" key='wide-screens'>
        <Menu fixed='top' inverted={inverted} >
          <Container fluid>
            <Menu.Item as={Link} to={'/'} header>
              <Image size='mini' src={logo} style={{ marginRight: '1.0em' }} />
            Aadhyaathma Kendram
          </Menu.Item>
            <Menu.Item as={Link} to={'/gods'}>Gods</Menu.Item>
            <Menu.Item as={Link} to={'/authors'}>Authors</Menu.Item>
            <Menu.Item as={Link} to={'/sanscript'}>Sanscript</Menu.Item>

            <Menu.Menu position='right'>
              <Menu.Item as={Link} to={'/settings'} icon={'cog'} />
              <Menu.Item as={Link} to={'/login'} icon={'user'} />
            </Menu.Menu>
          </Container>
        </Menu>
      </Media>
      <Media lessThan="computer" key='on-mobiles'>
        <Menu fixed='top' inverted={inverted} >
          <Container fluid>
            <Menu.Item header onClick={() => { toggleSideBar() }}>
              <Image size='mini' src={logo} style={{ marginRight: '1.0em' }} /> Aadhyaathma Kendram v1
          </Menu.Item>
            <Menu.Menu position='right'>
              {LanguageDDLB}
              {MeaningLanguageDDLB}
            </Menu.Menu>
          </Container>
        </Menu>
      </Media>
    </React.Fragment>
  )
}
export default NavBar