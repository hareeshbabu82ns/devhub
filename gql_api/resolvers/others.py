from devhub.authelia_middleware import AUTHELIA_USER_KEY
import requests
import json

from devhub.settings import ENV, AUTH_API

from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning, Bookmarks, Settings

import logging
logger = logging.getLogger(__name__)


def resolve_me(_, info):
    # user = {'id': '', 'display_name': ''}
    user = info.context.session.get(AUTHELIA_USER_KEY)
    # logger.warn(user)
    return user


DEFAULT_SETTINGS = {
    'language': '1',  # sanskrit
    'meaningLanguage': '3',  # english
    'fontSize': 2,  # in em
    'inverted': True,
}


def resolve_user_settings(parent, *_):
    settings = Settings()
    try:
        settings = Settings.objects.filter(user=parent['id'])[0]
    except Exception:
        # no settings, create defaults
        settings.user = parent['id']
        settings.content = json.dumps(DEFAULT_SETTINGS)
        settings.save()

    return settings
