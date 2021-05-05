from devhub.authelia_middleware import AUTHELIA_USER_KEY
import requests
import json
from graphqlclient import GraphQLClient

from devhub.settings import SANSKRIT_PARSER_API, SANSKRIT_PARSER_GQL_API

import logging
logger = logging.getLogger(__name__)

sansClient = GraphQLClient(SANSKRIT_PARSER_GQL_API)


def resolve_splits(*_, content, maxPaths, asDevanagari=False):
    qparams = {'max_paths': maxPaths}
    if asDevanagari:
        qparams['as_devanagari'] = asDevanagari

    # url = f'{SANSKRIT_PARSER_API}/splits/{content}'
    # res = requests.get(url, params=qparams)
    # return res.json()['splits']

    result = sansClient.execute('''
        query sansSplits(
            $text: String!
            $from: SanscriptScheme
            $to: SanscriptScheme
            $limit: Int
            ) {
            splits(
                text: $text
                schemeFrom: $from
                schemeTo: $to
                limit: $limit
                strictIO: false
            )
        }
    ''', {'text': content, 'from': 'SLP1',
          'to': 'DEVANAGARI' if asDevanagari else 'SLP1',
          'limit': maxPaths})
    # print(result)
    return json.loads(result)['data']['splits']


def resolve_sandhi(*_, splits, asDevanagari=False):
    qparams = {}
    if asDevanagari:
        qparams['as_devanagari'] = asDevanagari

    # url = f'{SANSKRIT_PARSER_API}/sandhi/{splits[0]}/{splits[1]}'
    # res = requests.get(url, params=qparams)
    # return res.json()['joins']

    result = sansClient.execute('''
        query sanskritSandhi(
            $splits: [String!]!
            $from: SanscriptScheme
            $to: SanscriptScheme
        ) {
            joins(words: $splits, schemeFrom: $from, schemeTo: $to, strictIO: false)
        }
    ''', {'splits': splits, 'from': 'SLP1', 'to': 'DEVANAGARI' if asDevanagari else 'SLP1'})
    return json.loads(result)['data']['joins']
