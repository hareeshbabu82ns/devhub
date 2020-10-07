from devhub.authelia_middleware import AUTHELIA_USER_KEY
import requests
import json

from devhub.settings import SANSKRIT_PARSER_API

import logging
logger = logging.getLogger(__name__)


def resolve_splits(*_, content, maxPaths, asDevanagari=False):
    qparams = {'max_paths': maxPaths}
    if asDevanagari:
        qparams['as_devanagari'] = asDevanagari

    url = f'{SANSKRIT_PARSER_API}/splits/{content}'
    res = requests.get(url, params=qparams)
    return res.json()['splits']


def resolve_sandhi(*_, splits, asDevanagari=False):
    qparams = {}
    if asDevanagari:
        qparams['as_devanagari'] = asDevanagari

    url = f'{SANSKRIT_PARSER_API}/sandhi/{splits[0]}/{splits[1]}'
    res = requests.get(url, params=qparams)
    return res.json()['joins']
