import { IconButton } from "@mui/material"
import { useEffect, useState } from "react"
import PlayIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

export default function AudioPlayPauseButton( { url } ) {
  const [ playing, setPlaying ] = useState( false )
  const [ player, setPlayer ] = useState( undefined )

  useEffect( () => {
    setPlayer( new Audio( url ) )
  }, [ url ] )

  const play = () => {
    setPlaying( true )
    player.play()
  }
  const pause = () => {
    setPlaying( false )
    player.pause()
  }

  return (
    <IconButton aria-label={playing ? 'Pause' : 'Play'}
      onClick={() => playing ? pause() : play()}>
      {playing && <PauseIcon />}
      {!playing && <PlayIcon />}
    </IconButton>
  )
}
