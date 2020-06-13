
from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


def resolve_entities(*_):
    return Entity.objects.all()


def resolve_children(parent, *_):
    related = EntityRelation.objects.select_related('to_entity').filter(
        from_entity=parent.id, from_type=parent.type.id)
    return [rel.to_entity for rel in related]


def resolve_parents(parent, *_):
    related = EntityRelation.objects.select_related('from_entity').filter(
        to_entity=parent.id, to_type=parent.type.id)
    return [rel.from_entity for rel in related]


def resolve_text_data(parent, *_):
    return EntityText.objects.filter(
        parent=parent.id, type=parent.type.id)


def resolve_meta_data(parent, *_):
    return EntityMeta.objects.filter(
        parent=parent.id, type=parent.type.id)


def resolve_content(parent, *_):
    return ContentLine.objects.filter(
        parent=parent.id)
