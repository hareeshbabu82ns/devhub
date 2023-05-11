import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { useRecoilState } from "recoil"
import SanscriptDictPage from "../pages/SanscriptDictPage"
import { sanscriptDictState } from "../state/sanscriptDict"

const SanscriptDictDrawer = () => {
  const [ state, setState ] = useRecoilState( sanscriptDictState )
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

      <SanscriptDictPage onClose={handleClose} />

      {/* 
      </Box>
      </Drawer> */}
    </Dialog>
  )
}
export default SanscriptDictDrawer