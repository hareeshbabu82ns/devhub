import React from 'react'
import { Container, Segment, Menu, Message } from 'semantic-ui-react'
import SettingsForm from '../components/settings_form'
import {
  useHistory,
} from "react-router-dom";
import { toast } from 'react-toastify'
import { useMutation, gql } from '@apollo/client';
import { useRecoilValue, useSetRecoilState } from 'recoil'
import settings from '../state/settings'
import user from '../state/user'

const Settings = () => {
  const history = useHistory()

  const setSettings = useSetRecoilState(settings)
  const settingsData = useRecoilValue(settings)
  const userData = useRecoilValue(user)

  const [updateSettings, { data: updatedSettings }] = useMutation(UPDATE_SETTINGS)

  const onSubmitClicked = async (data) => {
    try {
      await updateSettings({ variables: { user: userData.id, content: JSON.stringify(data) } })
      toast(<Message success header='Settings updated' />)
      // refetch()
      // setSettings(() => ({ ...JSON.parse(data.content) }))
    } catch (e) {
      toast(<Message success header='Error updating Settings' />)
    }
  }
  const onCloseClicked = () => {
    history.goBack()
  }

  return (
    <Container fluid>
      <Menu attached='top' inverted={settingsData.inverted}>
        <Menu.Item>
          <Menu.Header as='h4' content={'Settings'}></Menu.Header>
        </Menu.Item>
      </Menu>
      <Segment attached='bottom' inverted={settingsData.inverted}>
        <SettingsForm onSubmitClicked={onSubmitClicked} handleClose={onCloseClicked} />
      </Segment>
    </Container>
  )
}

export default Settings

const FETCH_SETTINGS = gql`
query GetSettings{
  me{
    id
    displayName
    settings{
      id
      user
      content
    }
  }
}
`;
const UPDATE_SETTINGS = gql`
mutation UpdateSettings($user:ID!,$content:String!){
  updateSettings(user:$user,content:$content){
    id
    user
    content
  }
}
`;
const DELETE_SETTINGS = gql`
mutation DeleteSettings($id:ID!){
  deleteSettings(id:$id)
}
`;