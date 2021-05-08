from devhub.authelia_middleware import AUTHELIA_USER_KEY
import requests
import json
from graphqlclient import GraphQLClient

from devhub.settings import SANSKRIT_PARSER_API, SANSKRIT_PARSER_GQL_API

import logging
logger = logging.getLogger(__name__)

# DICT_LIST = ['mw', 'mwe']
DICT_LIST = ['vcp', 'skd', 'mw', 'mwe']

sansClient = GraphQLClient(SANSKRIT_PARSER_GQL_API)


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
