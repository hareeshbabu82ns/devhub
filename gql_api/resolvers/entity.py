
from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


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

    return q


def resolve_children(parent, *_):
    related = EntityRelation.objects.select_related('to_entity').filter(
        from_entity=parent.id, from_type=parent.type.id)
    return [rel.to_entity for rel in related]


def resolve_parents(parent, *_):
    related = EntityRelation.objects.select_related('from_entity').filter(
        to_entity=parent.id, to_type=parent.type.id)
    return [rel.from_entity for rel in related]


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
