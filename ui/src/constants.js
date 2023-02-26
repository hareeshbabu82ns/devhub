export const drawerWidth = 240;
export const DATE_FORMAT_DB = 'YYYYMMDDHHmmss'
export const DATE_FORMAT_INPUT_FIELD = 'YYYY-MM-DDTHH:mm:ss'


export const APP_THEME_MODE = 'theme-mode'

export const C_ENTITY_TYPE_GOD = 'GOD'
export const C_ENTITY_TYPE_AUTHOR = 'AUTHOR'
export const C_ENTITY_TYPE_STHOTRAM = 'STHOTRAM'
export const C_ENTITY_TYPE_ADHYAAYAM = 'ADHYAAYAM'
export const C_ENTITY_TYPE_PARVAM = 'PARVAM'
export const C_ENTITY_TYPE_KAANDAM = 'KAANDAM'
export const C_ENTITY_TYPE_SLOKAM = 'SLOKAM'
export const C_ENTITY_TYPE_DANDAKAM = 'DANDAKAM'
export const C_ENTITY_TYPE_SARGA = 'SARGA'
export const C_ENTITY_TYPE_PURANAM = 'PURANAM'
export const C_ENTITY_TYPE_ITIHASAM = 'ITIHASAM'
export const C_ENTITY_TYPE_SKANDAM = 'SKANDAM'
export const C_ENTITY_TYPE_GHATTAM = 'GHATTAM'
export const C_ENTITY_TYPE_OTHERS = 'OTHERS'

export const C_LANGUAGE_DEFAULT = 'SAN'
export const C_LANGUAGE_MEANING_DEFAULT = 'TEL'

export const C_LANGUAGE_TEXT_LIST = [ 'SAN', 'TEL', 'SLP1', 'IAST' ]
export const C_TRANSLATE_TEXT_LIST = [ 'SAN', 'TEL', 'SLP1', 'IAST' ]
export const C_TRANSLATE_TEXT_MAP = [ { language: 'SAN', value: 'devanagari' },
{ language: 'TEL', value: 'telugu' }, { language: 'SLP1', value: 'slp1' }, { language: 'IAST', value: 'iast' } ]

export const C_DICTIONARY_MAP = [
  { label: 'Dhatu Pata', value: 'DHATU_PATA' },
  { label: 'English to Telugu', value: 'ENG2TEL' },

  { label: 'Abhidhānaratnamālā of Halāyudha San-San', value: 'ARMH' },
  { label: 'Vacaspatyam San-San', value: 'VCP' },
  { label: 'Sabda-kalpadrum San-San', value: 'SKD' },

  { label: 'Wilson San-Eng', value: 'WIL' },
  { label: 'Yates San-Eng', value: 'YAT' },
  { label: 'Goldstücker San-Eng', value: 'GST' },
  { label: 'Benfey San-Eng', value: 'BEN' },
  { label: 'Monier-Williams San-Eng', value: 'MW72' },
  { label: 'Apte Practical San-Eng', value: 'AP90' },
  { label: 'Lanman`s Sanskrit Reader Vocabulary', value: 'LAN' },
  { label: 'Cappeller San-Eng', value: 'CAE' },
  { label: 'Macdonell San-Eng', value: 'MD' },
  { label: 'Monier-Williams San-Eng', value: 'MW' },
  { label: 'Shabda-Sagara San-Eng', value: 'SHS' },
  { label: 'Practical San-Eng', value: 'AP' },
  { label: 'An Encyclopedic Dictionary', value: 'PD' },

  { label: 'Monier-Williams Eng-San', value: 'MWE' },
  { label: 'Borooah Eng-San', value: 'BOR' },
  { label: 'Apte Student`s Eng-San', value: 'AE' },

  { label: 'Index to the Names in the Mahabharata', value: 'INM' },
  { label: 'The Vedic Index of Names and Subjects', value: 'VEI' },
  { label: 'The Purana Index', value: 'PUI' },
  { label: 'Edgerton Buddhist Hybrid Sanskrit Dictionary', value: 'BHS' },
  { label: 'Aufrecht`s Catalogus Catalogorum', value: 'ACC' },
  { label: 'Kṛdantarūpamālā', value: 'KRM' },
  { label: 'Indian Epigraphical Glossary', value: 'IEG' },
  { label: 'Meulenbeld`s Sanskrit Names of Plants', value: 'SNP' },
  { label: 'Puranic Encyclopedia', value: 'PE' },
  { label: 'Personal and Geographical Names in the Gupta Inscriptions', value: 'PGN' },
  { label: 'Mahabharata Cultural Index', value: 'MCI' },

]

export const C_SANSCRIPT_SCHEME_MAP = [ { label: 'Devanagari', value: 'DEVANAGARI' },
{ label: 'IAST', value: 'IAST' }, { label: 'ITRANS', value: 'ITRANS' },
{ label: 'SLP1', value: 'SLP1' }, { label: 'TELUGU', value: 'TELUGU' },
{ label: 'TAMIL', value: 'TAMIL' }, { label: 'KANNADA', value: 'KANNADA' }, ]

export const C_ENTITY_ATTR_MEANING = 'each_word_meaning'
export const C_ENTITY_ATTR_BOOKMARK = 'bookmark'

export const C_DEFAULT_IMAGE_THUMBNAIL = 'data:image/png;base64,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'