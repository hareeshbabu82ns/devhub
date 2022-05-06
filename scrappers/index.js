const { Builder, By, Key, until } = require( 'selenium-webdriver' )
const { WAIT_SMALL, WAIT_MEDIUM } = require( './src/constants' );
const { fetchElementsFromURL } = require( './src/utils' );
const fs = require( 'fs' )

const dotEnv = require( 'dotenv' ).config( {
  // path: path.resolve(process.cwd(), '.env')
} );

( async function main() {

  const driver = await new Builder().forBrowser( 'chrome' ).build()

  try {

    const pTexts = await fetchElementsFromURL( driver, {
      url: 'https://stotranidhi.com/en/valmiki-ramayanam-yuddha-kanda-in-sanskrit/',
      byCssSelector: 'p'
    } )
    // console.log( JSON.stringify( pTexts, null, 2 ) )

    const content = JSON.stringify( pTexts, null, 2 )
    fs.writeFileSync( './titles.txt', content )

    await driver.sleep( WAIT_SMALL ) // wait before exiting

  } finally {
    await driver.quit()
  }

} )()