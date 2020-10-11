from devhub.authelia_middleware import AUTHELIA_USER_KEY
import requests
import json

from devhub.settings import SANSKRIT_PARSER_API

import logging
logger = logging.getLogger(__name__)

# DICT_LIST = ['mw', 'mwe']
DICT_LIST = ['vcp', 'skd', 'mw', 'mwe']


def resolve_dict_key_search(*_, key, maxHits, inDictionary='vcp', asDevanagari=False, searchContent=False):
    qparams = {'max_hits': maxHits}
    if searchContent:
        qparams['search_text'] = searchContent
    if asDevanagari:
        qparams['in_devanagari'] = asDevanagari
    if inDictionary == 'all':
        r = []
        for in_dictionary in DICT_LIST:
            url = f'{SANSKRIT_PARSER_API}/dict/{in_dictionary}/keys/{key}'
            res = requests.get(url, params=qparams)
            for val in res.json()['keys']:
                r.append(
                    {'id': val['key'], 'devanagari': val['devanagari']})
        # sort and remove duplicates
        # r = list(dict.fromkeys(r))
        r = list({frozenset(item.items()): item for item in r}.values())
        r.sort(key=lambda item: item['id'])
        return r[:maxHits]
    else:
        url = f'{SANSKRIT_PARSER_API}/dict/{inDictionary}/keys/{key}'
        res = requests.get(url, params=qparams)
        return res.json()['keys']


def resolve_dict_meanings(*_, keys, maxHits, inDictionary='vcp', asDevanagari=False):
    qparams = {'max_hits': maxHits}
    if asDevanagari:
        qparams['in_devanagari'] = asDevanagari
    headers = {'Content-type': 'application/json'}
    if inDictionary == 'all':
        r = []
        for in_dictionary in DICT_LIST:
            url = f'{SANSKRIT_PARSER_API}/dict/{in_dictionary}/meanings'
            res = requests.post(url, params=qparams,
                                data=json.dumps({'keys': keys}), headers=headers)
            # print(url, res.json())
            for val in res.json()['keys']:
                r.append(
                    {'id': f'{in_dictionary}_{val["lnum"]}', 'key': val['key'], 'from_dictionary': in_dictionary, 'content': val['data']})
        # sort and remove duplicates
        # r = list(dict.fromkeys(r))
        # print(r)
        # r = list({frozenset(item.items()): item for item in r}.values())
        r.sort(key=lambda item: item['key'])
        return r[:maxHits]
    else:
        url = f'{SANSKRIT_PARSER_API}/dict/{inDictionary}/meanings'
        res = requests.post(url, params=qparams,
                            data=json.dumps({'keys': keys}), headers=headers)
        data = res.json()

        r = []
        for val in data['keys']:
            r.append(
                {'id': f'{inDictionary}_{val["lnum"]}', 'key': val['key'], 'from_dictionary': inDictionary, 'content': val['data']})
        return r[:maxHits]
