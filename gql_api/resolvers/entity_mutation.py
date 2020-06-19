
from django.db import transaction

from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


@transaction.atomic()
def mutation_delete_entity(*_, id=None):
    res = Entity.objects.get(pk=id).delete()
    if res and res[0] > 0:
        return True
    else:
        return False


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
            contentMeaning = content.get('meaning')
            if contentMeaning:
                contentMeaningObj = ContentMeaning()
                contentMeaningObj.parent = contentObj
                contentMeaningObj.entity = entity
                contentMeaningObj.language = Language(
                    contentMeaning.get('language'))
                contentMeaningObj.content = contentMeaning.get('content')
                contentMeaningObj.save()
            # TODO: create content extras

    return entity


@transaction.atomic()
def mutation_delete_content(*_, id=None):
    res = ContentLine.objects.get(pk=id).delete()
    if res and res[0] > 0:
        return True
    else:
        return False


@transaction.atomic()
def mutation_update_content_line(*_, id=None, withData=None):

    # check for Parent Entity
    parentId = withData.get('parentEntity')
    parentEntity = None
    if parentId:
        parentEntity = Entity.objects.get(pk=parentId)
        if not parentEntity:
            return Exception(f"Parent Entity {parentId} does not exist")

    if not id:
        if parentId:
            try:
                # check if same language content already available
                contentObj = ContentLine.objects.filter(
                    parent=parentId, language=withData.get('language'))[0]
            except Exception:
                # create content of the new Entity
                contentObj = ContentLine()
    else:
        contentObj = ContentLine.objects.get(pk=id)

    contentObj.language = Language(withData.get('language'))
    contentObj.content = withData.get('content')

    if parentEntity:
        contentObj.parent = parentEntity

    contentObj.save()

    contentMeaningObj = None
    # create content meaning
    contentMeanings = withData.get('meaning', [])
    for contentMeaning in contentMeanings:
        contentMeaningObj = None
        # fetch existing content meanings
        try:
            contentMeaningObj = ContentMeaning.objects.filter(
                parent_id=contentObj.id, language=contentMeaning.get('language', '0'))[0]
        except Exception:
            contentMeaningObj = ContentMeaning()

        contentMeaningObj.parent = contentObj
        contentMeaningObj.entity = parentEntity
        contentMeaningObj.language = Language(
            contentMeaning.get('language'))
        contentMeaningObj.content = contentMeaning.get('content', '')
        contentMeaningObj.save()

    # TODO: create content extras

    return contentObj
