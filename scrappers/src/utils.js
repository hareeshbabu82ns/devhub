const { Builder, By, Key, until } = require( 'selenium-webdriver' )
const { WAIT_SMALL, WAIT_MEDIUM } = require( './constants' )

async function fetchElementsFromURL( driver, { url, waitForElement, byCssSelector } ) {
  await driver.get( `${url}` )

  if ( waitForElement )
    await driver.wait( until.elementLocated( By.id( waitForElement ) ) )

  const elements = await driver.findElements( By.css( byCssSelector ) )

  return Promise.all( elements.map( e => e.getText() ) )
}

module.exports = { fetchElementsFromURL }