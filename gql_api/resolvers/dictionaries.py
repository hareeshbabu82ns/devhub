from devhub.authelia_middleware import AUTHELIA_USER_KEY
from ariadne import EnumType
import requests
import enum
import json
from graphqlclient import GraphQLClient
from indic_transliteration import sanscript

from devhub.settings import SANSKRIT_PARSER_API, SANSKRIT_PARSER_GQL_API

import logging
logger = logging.getLogger(__name__)


class Dictionaries(enum.Enum):
    VCP = 'VCP'
    DHATU_PATA = 'DHATU_PATA'
    MW = 'MW'
    MWE = 'MWE'
    SKD = 'SKD'


dictionariesEnumType = EnumType("Dictionaries", Dictionaries)

# dictionariesEnumType = EnumType("Dictionaries",
#                                 {'ALL': 'all',
#                                  'SAN_SAN_VACASPATYAM': 'vcp',
#                                  'SAN_SAN_DHATU_PATA': 'dhatu_pata',
#                                  'SAN_SAN_SABDA_KALPADRUMA': 'skd',
#                                  'SAN_ENG_MONIER_WILLIAMS_1899': 'mw',
#                                  'ENG_SAN_MONIER_WILLIAMS': 'mwe'})


class SanscriptScheme(enum.Enum):
    DEVANAGARI = sanscript.DEVANAGARI
    IAST = sanscript.IAST
    ITRANS = sanscript.ITRANS
    SLP1 = sanscript.SLP1
    TELUGU = sanscript.TELUGU
    TAMIL = sanscript.TAMIL
    KANNADA = sanscript.KANNADA


sanscriptSchemesEnum = EnumType("SanscriptScheme", SanscriptScheme)


sansClient = GraphQLClient(SANSKRIT_PARSER_GQL_API)


def resolve_dict_search(*_, searchWith):
    query = '''
        query dictionarySearch(
            $searchWith: DictionarySearchInput!
        ) {
            dictionarySearch(
                searchWith: $searchWith
            ) {
                id
                key
                description
                origin
            }
        }
    '''

    filters = {
        'searchWith': {
            'search': searchWith['search'],
            'searchScheme': SanscriptScheme(searchWith.get('searchScheme', sanscript.DEVANAGARI)).value.upper(),
            'fuzzySearch': searchWith.get('fuzzySearch', False),
            'searchOnlyKeys': searchWith.get('searchOnlyKeys', False),
            'caseInsensitive': searchWith.get('caseInsensitive', False),
            'startsWith': searchWith.get('startsWith', False),
            'endsWith': searchWith.get('endsWith', False),
            'outputScheme': SanscriptScheme(searchWith.get('outputScheme', sanscript.DEVANAGARI)).value.upper(),
            'limit': searchWith.get('limit', 100)
        }
    }
    if searchWith.get('origin'):
        filters['searchWith']['origin'] = Dictionaries(
            searchWith.get('origin')).value

    result = sansClient.execute(query, filters)
    # print(result)
    res = json.loads(result)['data']['dictionarySearch']

    r = [{'id': val['id'],
          'key': val['key'],
          'from_dictionary': Dictionaries(val['origin']),
          'content': val['description']}
         for val in res]

    return r[:filters['searchWith']['limit']]


def resolve_dict_key_search(*_, key, maxHits, inDictionary='vcp',
                            asDevanagari=False, searchContent=False, fuzzySearch=False):
    query = '''
        query dictionaryKeySearch(
            $key: String!
            $maxHits: Int
            $searchOnlyKeys: Boolean
            $inDictionary: [Dictionary!]
            $outputScheme: SanscriptScheme
            $fuzzySearch: Boolean
        ) {
            dictionarySearch(
                searchWith: {
                    search: $key
                    searchScheme: SLP1
                    fuzzySearch: $fuzzySearch
                    startsWith: false
                    endsWith: false
                    searchOnlyKeys: $searchOnlyKeys
                    origin: $inDictionary
                    outputScheme: $outputScheme
                    limit: $maxHits
                }
            ) {
                key
            }
        }
    '''
    filters = {
        'key': key,
        'maxHits': maxHits,
        'searchOnlyKeys': not(searchContent),
        'inDictionary': [] if inDictionary == 'all' else [inDictionary.upper()],
        'outputScheme': 'DEVANAGARI' if asDevanagari else 'SLP1',
        'fuzzySearch': fuzzySearch
    }
    result = sansClient.execute(query, filters)
    # print(result)
    res = json.loads(result)['data']['dictionarySearch']

    r = [{'id': val['key'], 'devanagari': val['key']}
         for val in res]

    # sort and remove duplicates
    # r = list(dict.fromkeys(r))
    r = list({frozenset(item.items()): item for item in r}.values())
    r.sort(key=lambda item: item['id'])
    return r[:maxHits]


def resolve_dict_meanings(*_, keys, maxHits, inDictionary='vcp', asDevanagari=False):
    query = '''
        query dictionaryMeaningSearch(
            $key: String!
            $maxHits: Int
            $inDictionary: [Dictionary!]
            $outputScheme: SanscriptScheme
        ) {
            dictionarySearch(
                searchWith: {
                    search: $key
                    searchScheme: SLP1
                    fuzzySearch: false
                    startsWith: false
                    endsWith: false
                    searchOnlyKeys: true
                    origin: $inDictionary
                    outputScheme: $outputScheme
                    limit: $maxHits
                }
            ) {
                id
                key
                description
                origin
            }
        }
    '''
    filters = {
        'key': keys[0],
        'maxHits': maxHits,
        'inDictionary': [] if inDictionary == 'all' else [inDictionary.upper()],
        'outputScheme': 'DEVANAGARI' if asDevanagari else 'SLP1',
    }
    result = sansClient.execute(query, filters)
    # print(result)
    res = json.loads(result)['data']['dictionarySearch']

    r = [{'id': val['id'], 'key': val['key'], 'from_dictionary': val['origin'], 'content': val['description']}
         for val in res]

    return r[:maxHits]
