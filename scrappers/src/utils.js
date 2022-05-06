const { Builder, By, Key, until } = require( 'selenium-webdriver' )
const { WAIT_SMALL, WAIT_MEDIUM } = require( './constants' )

async function fetchElementsFromURL( driver, { url, waitForElement, byCssSelector, fetchElementAttributes, checkChildren } ) {
  await driver.get( `${url}` )

  if ( waitForElement )
    await driver.wait( until.elementLocated( By.id( waitForElement ) ) )

  const elements = await driver.findElements( By.css( byCssSelector ) )

  if ( fetchElementAttributes ) {
    const res = []
    for ( const e of elements ) {
      const ele = {}
      ele.tag = await e.getTagName()
      ele.text = await e.getText()
      for ( const attr of fetchElementAttributes ) {
        const attrVal = await e.getAttribute( attr )
        if ( attrVal )
          ele[ attr ] = attrVal
      }
      if ( checkChildren ) {
        for ( const child of checkChildren ) {
          const cElements = await e.findElements( By.css( child.tag ) )
          for ( const ce of cElements ) {
            for ( const attr of child.attributes ) {
              const attrVal = await ce.getAttribute( attr )
              if ( attrVal )
                ele[ child.tag ] = attrVal
            }
          }
        }
      }
      res.push( ele )
    }
    return res
  }
  else
    return Promise.all( elements.map( e => e.getText() ) )
}

module.exports = { fetchElementsFromURL }