import { useEffect, useCallback, useState } from "react";
import { getSelectionText } from "./utils";

const useContextMenu = ( { showOnlyOnTextSelection = false } = {} ) => {
  const [ anchorPoint, setAnchorPoint ] = useState( { x: 0, y: 0 } );
  const [ showContext, setShow ] = useState( false );
  const [ selectedText, setSelectedText ] = useState( '' );

  const handleContextMenu = useCallback(
    ( event ) => {

      if ( showOnlyOnTextSelection ) {
        const selText = getSelectionText()
        setSelectedText( selText )
        if ( selText?.length > 0 ) {
          event.preventDefault()
          setAnchorPoint( { x: event.pageX, y: event.pageY } );
          setShow( true );
        }
      } else {
        event.preventDefault();
        setAnchorPoint( { x: event.pageX, y: event.pageY } );
        setShow( true );
      }

    },
    [ setShow, setAnchorPoint, setSelectedText, showOnlyOnTextSelection ]
  );

  const handleClick = useCallback( () => ( showContext ? setShow( false ) : null ), [ showContext ] );

  useEffect( () => {
    document.addEventListener( "click", handleClick );
    document.addEventListener( "contextmenu", handleContextMenu );
    return () => {
      document.removeEventListener( "click", handleClick );
      document.removeEventListener( "contextmenu", handleContextMenu );
    };
  } );
  return { anchorPoint, showContext, selectedText };
};

export default useContextMenu;