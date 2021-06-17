import enum
from ariadne import EnumType
from indic_transliteration import sanscript


class SanscriptScheme(enum.Enum):
    DEVANAGARI = sanscript.DEVANAGARI
    IAST = sanscript.IAST
    ITRANS = sanscript.ITRANS
    SLP1 = sanscript.SLP1
    TELUGU = sanscript.TELUGU
    TAMIL = sanscript.TAMIL
    KANNADA = sanscript.KANNADA


sanscriptSchemesEnum = EnumType("SanscriptScheme", SanscriptScheme)
