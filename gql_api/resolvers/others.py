import requests
import json

from devhub.settings import ENV, AUTH_API

from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning, Bookmarks, Settings


def resolve_me(_, info):
    user = {'id': '', 'displayName': ''}
    if ENV == 'local' or AUTH_API == '':
        user['id'] = 'local'
        user['display_name'] = 'local'
    else:
        request = info.context
        if AUTH_API:
            r = requests.get(AUTH_API+'/api/state', cookies=request.COOKIES)
            if r.status_code == '200':
                json_data = r.json()['data']
                user.setdefault('id', json_data['username'])

            r = requests.get(AUTH_API+'/api/user/info',
                             cookies=request.COOKIES)
            if r.status_code == '200':
                json_data = r.json()['data']
                user.setdefault('display_name', json_data['display_name'])
    return user


DEFAULT_SETTINGS = {
    'language': '1',  # sanskrit
    'meaningLanguage': '3',  # english
    'fontSize': 2,  # in em
    'inverted': True,
}


def resolve_user_settings(parent, *_):
    print(parent)
    settings = Settings()
    try:
        settings = Settings.objects.filter(user=parent['id'])[0]
    except:
        # no settings, create defaults
        settings.user = parent['id']
        settings.content = json.dumps(DEFAULT_SETTINGS)
        settings.save()

    return settings
