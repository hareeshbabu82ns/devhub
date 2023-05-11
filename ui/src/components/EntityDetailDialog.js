import { Dialog } from "@mui/material"
import { useRecoilState } from "recoil"
import EntityDetailPage from "../pages/EntityDetailPage"
import { entityDetailState } from "../state/entityDetail"

const EntityDetailDialog = () => {
  const [ state, setState ] = useRecoilState( entityDetailState )
  const handleClose = () => setState( s => ( { ...s, drawerOpened: false } ) )
  return (
    <Dialog
      onClose={handleClose}
      open={state.drawerOpened} scroll={'paper'}
      fullScreen={true}
    >
      <EntityDetailPage key={state.entityId || ''} entityId={state.entityId} onClose={handleClose} />
    </Dialog>
  )
}
export default EntityDetailDialog