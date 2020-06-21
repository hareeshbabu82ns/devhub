from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


def resolve_content_lines(*_, by=None):
    if not by:
        return Exception('argument missing error')

    q = ContentLine.objects

    lang = by.get('language')
    if lang:
        q = q.filter(language=lang)

    id = by.get('id')
    if id:
        q = q.filter(id=id)

    parent = by.get('parent')
    if parent:
        q = q.filter(parent=parent)

    return q


def resolve_content_meanings(*_, by=None):
    if not by:
        return Exception('argument missing error')

    q = ContentMeaning.objects

    lang = by.get('language')
    if lang:
        q = q.filter(language=lang)

    id = by.get('id')
    if id:
        q = q.filter(id=id)

    parent = by.get('parent')
    if parent:
        q = q.filter(parent=parent)

    return q


def resolve_content_line_meaning(parent, *_, language=None):
    if not language:
        return Exception('Language parameter missing')
    q = None
    try:
        q = ContentMeaning.objects.filter(
            parent=parent.parent.id, language=language)[0]
    except Exception:
        pass
    return q


def resolve_content_line_extras(parent, *_):
    return ContentExtras.objects.filter(parent=parent.id)[0]
