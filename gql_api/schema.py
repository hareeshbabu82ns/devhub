# schema.py
from ariadne import make_executable_schema, snake_case_fallback_resolvers
from ariadne import ObjectType

from devhub.gql_root_types import query
from .models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


types = []

# Content
contentLineType = ObjectType('ContentLine')


@contentLineType.field("meaning")
def resolve_content_line_meaning(parent, *_):
    return ContentMeaning.objects.filter(parent=parent.id)[0]


@contentLineType.field("extras")
def resolve_content_line_extras(parent, *_):
    return ContentExtras.objects.filter(parent=parent.id)[0]


types.append(contentLineType)

# Entity
entityType = ObjectType('Entity')


@query.field("entities")
def resolve_entities(*_):
    return Entity.objects.all()


@entityType.field("childEntities")
def resolve_entity_children(parent, *_):
    related = EntityRelation.objects.select_related('to_entity').filter(
        from_entity=parent.id, from_type=parent.type.id)
    return [rel.to_entity for rel in related]


@entityType.field("parentEntities")
def resolve_entity_parents(parent, *_):
    related = EntityRelation.objects.select_related('from_entity').filter(
        to_entity=parent.id, to_type=parent.type.id)
    return [rel.from_entity for rel in related]


@entityType.field("textData")
def resolve_entity_text_data(parent, *_):
    return EntityText.objects.filter(
        parent=parent.id, type=parent.type.id)


@entityType.field("metaData")
def resolve_entity_meta_data(parent, *_):
    return EntityMeta.objects.filter(
        parent=parent.id, type=parent.type.id)


@entityType.field("content")
def resolve_entity_content(parent, *_):
    return ContentLine.objects.filter(
        parent=parent.id)


types.append(entityType)


# EntityType
entityTypeType = ObjectType('EntityType')


@query.field("entityTypes")
def resolve_entity_types(*_):
    return EntityType.objects.all()


types.append(entityTypeType)

# Language
languageType = ObjectType('Language')


@query.field("languages")
def resolve_language(*_):
    return Language.objects.all()


types.append(languageType)
