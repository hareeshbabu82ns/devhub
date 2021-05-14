import enum
from ariadne import ObjectType, EnumType

from devhub.gql_root_types import query, mutation
from .models import EntityType, Language, Settings

from gql_api.resolvers import entity as entity_resolvers, content as content_resolvers, entity_mutation as entity_mutations, content_mutations, others as other_resolvers, others_mutations, dictionaries as dict_resolvers, sanskrit_parser as sparser_resolvers

types = []

# ContentMeaning

query.set_field("contentMeanings", content_resolvers.resolve_content_meanings)

mutation.set_field("updateContentMeaning",
                   content_mutations.mutation_update_content_meaning)
mutation.set_field("deleteContentMeaning",
                   content_mutations.mutation_delete_content_meaning)

# Content

query.set_field("contentLines", content_resolvers.resolve_content_lines)

contentLineType = ObjectType('ContentLine')

contentLineType.set_field(
    "meaning", content_resolvers.resolve_content_line_meaning)

contentLineType.set_field(
    "extras", content_resolvers.resolve_content_line_extras)

mutation.set_field("updateContent",
                   content_mutations.mutation_update_content)
mutation.set_field("deleteContent",
                   content_mutations.mutation_delete_content)

types.append(contentLineType)

# Entity
entityType = ObjectType('Entity')

query.set_field("entities", entity_resolvers.resolve_entities)

mutation.set_field("updateEntityContent",
                   entity_mutations.mutation_update_entity_content)
mutation.set_field("deleteEntity",
                   entity_mutations.mutation_delete_entity)


entityType.set_field("childEntities", entity_resolvers.resolve_children)

entityType.set_field("parentEntities", entity_resolvers.resolve_parents)

entityType.set_field("textData", entity_resolvers.resolve_text_data)

entityType.set_field("metaData", entity_resolvers.resolve_meta_data)

entityType.set_field("content", entity_resolvers.resolve_content)
entityType.set_field(
    "contentMeaning", entity_resolvers.resolve_content_meaning)

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

# Bookmark
bookmarkType = ObjectType('Bookmark')

query.set_field("bookmarks", entity_resolvers.resolve_bookmarks)

mutation.set_field("updateBookmark",
                   entity_mutations.mutation_update_bookmark)
mutation.set_field("deleteBookmark",
                   entity_mutations.mutation_delete_bookmark)
types.append(bookmarkType)

# Settings
settingType = ObjectType('Settings')

mutation.set_field("updateSettings",
                   others_mutations.mutation_update_user_settings)
# mutation.set_field("deleteSetting",
#                    entity_mutations.mutation_delete_setting)
types.append(settingType)

# User
userType = ObjectType('User')

userType.set_field(
    "settings", other_resolvers.resolve_user_settings)

query.set_field("me", other_resolvers.resolve_me)

types.append(userType)

# Sanskrit Parser Tools
query.set_field("sanskritSplits", sparser_resolvers.resolve_splits)
query.set_field("sanskritSandhi", sparser_resolvers.resolve_sandhi)

# Dictionaries

types.append(dict_resolvers.dictionariesEnumType)
types.append(dict_resolvers.sanscriptSchemesEnum)

dictionaryType = ObjectType('DictionaryItem')

query.set_field("dictionaryKeySearch", dict_resolvers.resolve_dict_key_search)
query.set_field("dictionaryMeanings", dict_resolvers.resolve_dict_meanings)
query.set_field("dictionarySearch", dict_resolvers.resolve_dict_search)

types.append(dictionaryType)
