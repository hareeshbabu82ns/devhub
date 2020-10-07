from devhub.authelia_middleware import AUTHELIA_USER_KEY
import requests
import json

from devhub.settings import SANSKRIT_PARSER_API

import logging
logger = logging.getLogger(__name__)

DICT_LIST = ['vcp', 'skd', 'mw', 'mwe']


def resolve_dict_key_search(*_, key, maxHits, inDictionary='vcp', searchContent=False):
    qparams = {'max_hits': maxHits, 'search_text': searchContent}
    if inDictionary == 'all':
        r = []
        for in_dictionary in DICT_LIST:
            url = f'{SANSKRIT_PARSER_API}/dict/{in_dictionary}/keys/{key}'
            res = requests.get(url, params=qparams)
            r.extend(res.json()['keys'])
        return r[:maxHits]
    else:
        url = f'{SANSKRIT_PARSER_API}/dict/{inDictionary}/keys/{key}'
        res = requests.get(url, params=qparams)
        return res.json()['keys']


def resolve_dict_meanings(*_, keys, maxHits, inDictionary='vcp'):
    qparams = {'max_hits': maxHits}
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
                    {'id': val['key'], 'from_dictionary': in_dictionary, 'content': val['data']})
        return r[:maxHits]
    else:
        url = f'{SANSKRIT_PARSER_API}/dict/{inDictionary}/meanings'
        res = requests.post(url, params=qparams,
                            data=json.dumps({'keys': keys}), headers=headers)
        data = res.json()

        r = []
        for val in data['keys']:
            r.append(
                {'id': val['key'], 'from_dictionary': inDictionary, 'content': val['data']})
        return r[:maxHits]
