import React from 'react'
import { useRecoilValue } from 'recoil'
import { Input, Label, Menu } from 'semantic-ui-react'

import {
  Link,
  useRouteMatch,
} from "react-router-dom";
import settings from '../../state/settings'

const SanscriptSideNav = () => {
  let match = useRouteMatch();
  const settingsData = useRecoilValue(settings)
  return (
    <React.Fragment>
      <Menu attached='top' fluid borderless inverted={settingsData.inverted} color='blue' stackable>
        <Menu.Item>
          <Menu.Header as='h4' content={'Sanscript'} />
        </Menu.Item>
      </Menu>
      <Menu vertical fluid attached='bottom' inverted={settingsData.inverted}>
        <Menu.Item
          as={Link} name='trans'
          to={`${match.url}/translations`}
        >
          Translations
        </Menu.Item>
        <Menu.Item
          as={Link} name='parser'
          to={`${match.url}/parser`}
        >
          Sanskrit Parser
        </Menu.Item>
        <Menu.Item
          as={Link} name='dict'
          to={`${match.url}/dictionaries`}
        >
          Dictionaries
        </Menu.Item>
      </Menu>
    </React.Fragment>
  )
}
export default SanscriptSideNav