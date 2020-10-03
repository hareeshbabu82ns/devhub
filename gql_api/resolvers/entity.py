
from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning, Bookmarks

from devhub.authelia_middleware import AUTHELIA_USER_KEY


def resolve_entities(*_, by=None):
    if not by:
        return Exception('argument missing error')

    q = Entity.objects

    id = by.get('id')
    if id:
        q = q.filter(id=id)

    type = by.get('type')
    if type:
        q = q.filter(type=type)

    text_like = by.get('textLike')
    if text_like:
        q = q.filter(default_text__contains=text_like)

    text = by.get('text')
    if not text_like and text:
        q = q.filter(default_text=text)

    return q


def resolve_child_types(parent, *_):
    q = EntityRelation.objects.select_related('to_type').filter(
        from_entity=parent.id, from_type=parent.type.id)
    return set(rel.to_type for rel in q)


def resolve_children(parent, *_, by=None):
    q = EntityRelation.objects.select_related('to_entity').filter(
        from_entity=parent.id, from_type=parent.type.id)

    if by:
        filterBy = {}
        to_type = by.get('type')
        if to_type:
            filterBy['to_type'] = to_type

        hasContentInLanguage = by.get('hasContentInLanguage')
        if hasContentInLanguage:
            filterBy['to_entity__contentline__language'] = hasContentInLanguage

        # filters with AND condition goes into single filter()
        q = q.filter(**filterBy)

    res = [rel.to_entity for rel in q]

    res.sort(key=entity_sort_by_order)
    return res


def entity_sort_by_order(entity):
    # print(entity.order, type(entity.order))
    return entity.order


def resolve_parents(parent, *_, by=None):
    q = EntityRelation.objects.select_related('from_entity').filter(
        to_entity=parent.id, to_type=parent.type.id)

    if by:
        type = by.get('type')
        if type:
            q = q.filter(to_type=type)

    return [rel.from_entity for rel in q]


def resolve_text_data(parent, *_, language=None):
    q = EntityText.objects

    q = q.filter(
        parent=parent.id, type=parent.type.id)

    if language:
        q = q.filter(language=language)

    return q


def resolve_meta_data(parent, *_):
    return EntityMeta.objects.filter(
        parent=parent.id, type=parent.type.id)


def resolve_content(parent, *_, language=None):
    if not language:
        return Exception('Language parameter missing')
    return ContentLine.objects.filter(
        parent=parent.id, language=language)


def resolve_content_meaning(parent, *_, language=None):
    if not language:
        return Exception('Language parameter missing')
    return ContentMeaning.objects.filter(
        parent=parent.id, language=language)


def resolve_bookmarks(_, info, by=None):
    q = Bookmarks.objects

    user = info.context.session.get(AUTHELIA_USER_KEY)
    q = q.filter(user=user['id'])

    if not by:
        return q

    id = by.get('id')
    if id:
        q = q.filter(id=id)

    entity = by.get('entity')
    if entity:
        q = q.filter(entity=entity)

    url = by.get('url')
    if url:
        q = q.filter(default_text__contains=url)

    return q
