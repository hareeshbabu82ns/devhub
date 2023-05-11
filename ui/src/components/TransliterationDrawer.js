import { Dialog, DialogTitle, IconButton } from "@mui/material"
import { useRecoilState } from "recoil"
import TransliteratePage from "../pages/TransliteratePage"
import { transliterationState } from "../state/transliteration"


const TransliterationDrawer = () => {
  const [ state, setState ] = useRecoilState( transliterationState )
  const handleClose = () => setState( s => ( { ...s, drawerOpened: false } ) )
  return (
    <Dialog
      onClose={handleClose}
      open={state.drawerOpened} scroll={'paper'}
      fullScreen={true}
    >
      {/* <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: ( theme ) => theme.palette.grey[ 500 ],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle> */}
      {/* <Drawer
      anchor="right"
      open={state.drawerOpened}
      onClose={() => { setState( s => ( { ...s, drawerOpened: false } ) ) }}
      variant='persistent'
    >
      <Box sx={{ pt: 10, width: '100vw' }}> */}
      <TransliteratePage onClose={handleClose} />
      {/* </Box>
    </Drawer> */}
    </Dialog>
  )
}
export default TransliterationDrawer