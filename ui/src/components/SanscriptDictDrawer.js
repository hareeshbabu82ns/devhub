import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { useRecoilState } from "recoil"
import SanscriptDictPage from "../pages/SanscriptDictPage"
import { sanscriptDictState } from "../state/sanscriptDict"
import CloseIcon from '@mui/icons-material/Close'

const SanscriptDictDrawer = () => {
  const [ state, setState ] = useRecoilState( sanscriptDictState )

  return (
    <Dialog
      onClose={() => setState( s => ( { ...s, drawerOpened: false } ) )}
      open={state.drawerOpened} scroll={'paper'}
      fullScreen={true}
    >
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setState( s => ( { ...s, drawerOpened: false } ) )}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: ( theme ) => theme.palette.grey[ 500 ],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {/* <Drawer
      anchor="right"
      open={state.drawerOpened}
      onClose={() => { setState( s => ( { ...s, drawerOpened: false } ) ) }}
      variant='persistent'
    > 
    <Box sx={{ pt: 10, width: '100vw' }}>
    */}

      <SanscriptDictPage />

      {/* 
      </Box>
      </Drawer> */}
    </Dialog>
  )
}
export default SanscriptDictDrawer