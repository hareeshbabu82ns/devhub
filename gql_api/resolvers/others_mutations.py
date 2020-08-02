import json
from django.db import transaction

from gql_api.models import Settings

from gql_api.resolvers.others import DEFAULT_SETTINGS


@transaction.atomic()
def mutation_update_user_settings(*_, user=None, content=None):
    if not user:
        return Exception('user parameter missing')

    content_json = ''
    if not content:
        content_json = json.dumps(DEFAULT_SETTINGS)
    else:
        content_json = content

    try:
        settings = Settings.objects.filter(user=user)[0]
    except Exception:
        settings = Settings()
        # no settings, create defaults
        settings.user = user

    settings.content = content_json
    settings.save()

    return settings
