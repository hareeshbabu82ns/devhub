from ariadne import ObjectType

from devhub.gql_root_types import query
from .models import EntityType, Language

from gql_api.resolvers import entity as entity_resolvers, content as content_resolvers

types = []

# Content

query.set_field("contentLines", content_resolvers.resolve_content_lines)

contentLineType = ObjectType('ContentLine')

contentLineType.set_field(
    "meaning", content_resolvers.resolve_content_line_meaning)

contentLineType.set_field(
    "extras", content_resolvers.resolve_content_line_extras)

types.append(contentLineType)

# Entity
entityType = ObjectType('Entity')

query.set_field("entities", entity_resolvers.resolve_entities)

entityType.set_field("childEntities", entity_resolvers.resolve_children)

entityType.set_field("parentEntities", entity_resolvers.resolve_parents)

entityType.set_field("textData", entity_resolvers.resolve_text_data)

entityType.set_field("metaData", entity_resolvers.resolve_meta_data)

entityType.set_field("content", entity_resolvers.resolve_content)

entityType.set_field("childTypes", entity_resolvers.resolve_child_types)

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
