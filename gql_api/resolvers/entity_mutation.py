
from django.db import transaction

from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning, Bookmarks

from devhub.authelia_middleware import AUTHELIA_USER_KEY


@transaction.atomic()
def mutation_delete_entity(*_, id=None):
    entity = Entity.objects.get(pk=id)
    if entity.type.name in ['Stotram', 'Puranam']:
        delete_child_entities(entity)

    res = entity.delete()
    if res and res[0] > 0:
        return True
    else:
        return False


def delete_child_entities(entity):
    q = EntityRelation.objects.select_related('to_entity').filter(
        from_entity=entity.id, from_type=entity.type.id)
    entity_rel = [rel.to_entity for rel in q]
    # print('deleting child entities:', entity_rel)
    if len(entity_rel):
        for child_entity in entity_rel:
            delete_child_entities(child_entity)
            child_entity.delete()


@transaction.atomic()
def mutation_update_entity_content(*_, id=None, withData):
    if not withData:
        return Exception('data parameter missing')

    # check for Parent Entity
    parentId = withData.get('parentId')
    parentEntity = None
    if parentId:
        parentEntity = Entity.objects.get(pk=parentId)
        if not parentEntity:
            return Exception(f"Parent Entity {parentId} does not exist")

    if id:
        # fetch Entity
        entity = Entity.objects.get(pk=id)
        if not entity:
            return Exception(f"Entity {id} does not exist")
        entityType = entity.type
    else:
        # create new Entity
        entity = Entity()
        entityType = EntityType(withData['type'])

    entity.type = entityType
    entity.default_text = withData.get('defaultText', entity.default_text)
    entity.tags = withData.get('tags', entity.tags)
    entity.order = withData.get('order', entity.order)
    entity.save()

    relation = None
    if parentEntity and id:
        try:
            # get existing relationship with parent
            relation = EntityRelation.objects.filter(
                from_entity=parentId, to_entity=id)[0]
        except Exception:
            pass

    if parentEntity and not relation:
        # create relationship From Parent to new Entity
        relation = EntityRelation()
        relation.from_entity = parentEntity
        relation.from_type = parentEntity.type
        relation.to_entity = entity
        relation.to_type = entityType
        relation.save()

    currentTextDatas = []
    if id:
        # fetch existing textData
        currentTextDatas = EntityText.objects.filter(parent=id)

    # create textData of the new Entity
    textDatas = withData.get('textData', [])
    for textData in textDatas:
        textDataObj = None
        textDataId = textData.get('id', '')
        if textDataId.startswith('new'):
            # create textData of the new Entity
            textDataObj = EntityText()

        elif textDataId.startswith('del_'):
            # delete the marked text data
            EntityText.objects.get(pk=textDataId.split('del_')[1]).delete()
        else:
            # update the text data
            for currentTextData in currentTextDatas:
                if currentTextData.id == textDataId or currentTextData.language.id == int(textData.get('language', '0')):
                    textDataObj = currentTextData
                    break
            if not textDataObj:
                textDataObj = EntityText()

        if textDataObj:
            textDataObj.language = Language(textData.get('language'))
            textDataObj.text = textData.get('text', '')
            textDataObj.description = textData.get('description', '')
            textDataObj.parent = entity
            textDataObj.type = entity.type
            if len(textDataObj.text) == 0 and len(textDataObj.description) == 0 and textDataObj.id:
                textDataObj.delete()
            else:
                textDataObj.save()

    if not id:
        # create content of the new Entity
        contents = withData.get('content', [])
        for content in contents:
            contentObj = ContentLine()
            contentObj.language = Language(content.get('language'))
            contentObj.content = content.get('content')
            contentObj.parent = entity
            contentObj.save()
        # create content meaning
        contentMeanings = withData.get('meaning', [])
        for contentMeaning in contentMeanings:
            contentMeaningObj = ContentMeaning()
            contentMeaningObj.parent = entity
            contentMeaningObj.language = Language(
                contentMeaning.get('language'))
            contentMeaningObj.content = contentMeaning.get('content')
            contentMeaningObj.save()
        # create content extras
        contentExtras = withData.get('extras', [])
        for contentExtra in contentExtras:
            contentExtrasObj = ContentExtras()
            contentExtrasObj.parent = entity
            contentExtrasObj.language = Language(
                contentExtra.get('language'))
            contentExtrasObj.content = contentExtra.get('content')
            contentExtrasObj.save()

    return entity


@transaction.atomic()
def mutation_delete_bookmark(*_, id=None):
    entity = Bookmarks.objects.get(pk=id)
    res = entity.delete()
    if res and res[0] > 0:
        return True
    else:
        return False


@transaction.atomic()
def mutation_update_bookmark(_, info, id=None, withData=None):
    if not withData:
        return Exception('data parameter missing')

    user = info.context.session.get(AUTHELIA_USER_KEY)

    # check for Parent Entity
    parentId = withData.get('entity')
    parentEntity = None
    if parentId:
        parentEntity = Entity.objects.get(pk=parentId)
        if not parentEntity:
            return Exception(f"Parent Entity {parentId} does not exist")

    if id:
        # fetch Entity
        entity = Bookmarks.objects.get(pk=id)
        if not entity:
            return Exception(f"Bookmark {id} does not exist")

        if entity.user != user['id']:
            return Exception(f"Bookmark {id} is not from User {user['id']}")
    else:
        # create new Entity
        entity = Bookmarks()
        entity.user = user['id']

    entity.entity = parentEntity
    entity.url = withData.get('url', entity.url)
    entity.save()

    return entity
