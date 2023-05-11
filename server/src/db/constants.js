const LANGUAGE_DEFAULT_INPUT = "DEFAULT"
const LANGUAGE_DEFAULT_ISO = process.env.LANGUAGE_DEFAULT_ISO || "SAN"
const DEFAULT_ENTITY_THUMBNAIL = 'https://picsum.photos/300/250'

const LANGUAGE_SCHEME_MAP = {
  'SAN': 'devanagari',
  'TEL': 'telugu',
  'HIN': 'hindi',
  'TAM': 'tamil',
  'IAST': 'iast',
  'SLP1': 'slp1',
}

module.exports = {
  LANGUAGE_DEFAULT_INPUT,
  LANGUAGE_DEFAULT_ISO,
  LANGUAGE_SCHEME_MAP,
  DEFAULT_ENTITY_THUMBNAIL,
}