from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


def resolve_content_line_meaning(parent, *_):
    return ContentMeaning.objects.filter(parent=parent.id)[0]


def resolve_content_line_extras(parent, *_):
    return ContentExtras.objects.filter(parent=parent.id)[0]
