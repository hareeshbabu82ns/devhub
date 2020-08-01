import { createMedia } from "@artsy/fresnel"

const mediaContext = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920
  }
})

export const { Media, MediaContextProvider, createMediaStyle } = mediaContext