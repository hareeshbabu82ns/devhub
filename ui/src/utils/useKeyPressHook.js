// ref: https://devtrium.com/posts/how-keyboard-shortcut
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

export const C_KEY_CTRL = 'CTRL'
export const C_KEY_SHIFT = 'SHIFT'
export const C_KEY_ALT = 'ALT'
export const C_KEY_META = 'META'
export const C_KEY_DELIMITER = '+'


const buildKeyString = ( e ) => {
  const keys = []
  e.ctrlKey && keys.push( C_KEY_CTRL )
  e.shiftKey && keys.push( C_KEY_SHIFT )
  e.altKey && keys.push( C_KEY_ALT )
  e.metaKey && keys.push( C_KEY_META )
  keys.push( e.key )
  return keys.join( C_KEY_DELIMITER )
}
const useKeyPress = ( keys, callback, node = null ) => {
  // implement the callback ref pattern
  const callbackRef = useRef( callback )
  useLayoutEffect( () => {
    callbackRef.current = callback
  } )

  // handle what happens on key press
  const handleKeyPress = useCallback(
    ( event ) => {
      const eventKey = buildKeyString( event )
      // console.log( eventKey )
      // check if one of the key is part of the ones we want
      const matched = keys.some( ( key ) => eventKey === key )
      if ( matched ) {
        const handled = callbackRef.current( {
          event,
          eventKey
        } )
        if ( handled ) event.stopPropagation()
      }
    },
    [ keys ]
  )

  useEffect( () => {
    // target is either the provided node or the document
    const targetNode = node ?? document
    // attach the event listener
    targetNode &&
      targetNode.addEventListener( "keydown", handleKeyPress )

    // remove the event listener
    return () =>
      targetNode &&
      targetNode.removeEventListener( "keydown", handleKeyPress )
  }, [ handleKeyPress, node ] )
}

export default useKeyPress