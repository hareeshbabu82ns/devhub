import { Dialog } from "@mui/material"
import { useRecoilState } from "recoil"
import SanscriptSplitsPage from "../pages/SanscriptSplitsPage"
import { sanscriptSplitsState } from "../state/sanscriptSplits"

const SanscriptSplitsDrawer = () => {
  const [ state, setState ] = useRecoilState( sanscriptSplitsState )
  const handleClose = () => setState( s => ( { ...s, drawerOpened: false } ) )
  return (
    <Dialog
      onClose={handleClose}
      open={state.drawerOpened} scroll={'paper'}
      fullScreen={true}
    >
      {/* <Drawer
      anchor="right"
      open={state.drawerOpened}
      onClose={() => { setState( s => ( { ...s, drawerOpened: false } ) ) }}
      variant='persistent'
    > 
    <Box sx={{ pt: 10, width: '100vw' }}>
    */}

      <SanscriptSplitsPage onClose={handleClose} />

      {/* 
      </Box>
      </Drawer> */}
    </Dialog>
  )
}
export default SanscriptSplitsDrawer