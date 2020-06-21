import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { useHistory, useLocation } from 'react-router-dom'
import EntityModalContent from './entity_modal'
import ContentModalContent from './content_modal'


const OperationModal = () => {
  const hisotry = useHistory()
  const location = useLocation()

  const [modalOpen, setModalOpen] = useState(false)

  const params = new URLSearchParams(location.search)

  useEffect(() => {
    if (params.get('operation')) {
      setModalOpen(true)
    }
  }, [location])

  const handleClose = () => {
    setModalOpen(false)
    hisotry.goBack()
  }

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      basic
      size='fullscreen'
    >
      <Modal.Content>
        {(params.get('operation') === 'createEntity' ||
          params.get('operation') === 'editEntity') &&
          <EntityModalContent handleClose={handleClose}
            entityId={params.get('entityId')}
            parentEntity={params.get('parentEntity')}
            createType={params.get('createType')} />}

        {(params.get('operation') === 'createContent' ||
          params.get('operation') === 'editContent') &&
          <ContentModalContent handleClose={handleClose}
            entityId={params.get('entityId')}
            parentEntity={params.get('parentEntity')}
            createType={params.get('createType')} />}
      </Modal.Content>
    </Modal>
  )
}

export default OperationModal