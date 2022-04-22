import { Drawer } from "@mui/material"
import { Box } from "@mui/system"
import { useRecoilState } from "recoil"
import TransliteratePage from "../pages/TransliteratePage"
import { transliterationState } from "../state/transliteration"

const TransliterationDrawer = () => {
  const [ state, setState ] = useRecoilState( transliterationState )

  return (
    <Drawer
      anchor="right"
      open={state.drawerOpened}
      onClose={() => { setState( s => ( { ...s, drawerOpened: false } ) ) }}
      variant='persistent'
    >
      <Box sx={{ pt: 10, width: '100vw' }}>
        <TransliteratePage />
      </Box>
    </Drawer>
  )
}
export default TransliterationDrawer