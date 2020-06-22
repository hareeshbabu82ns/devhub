from gql_api.models import Entity, EntityRelation, EntityMeta, EntityText, EntityType, ContentLine, ContentMeaning, ContentExtras


def run():
    entities = Entity.objects.all()
    for entity in entities:
        print(entity.id, entity.default_text)
