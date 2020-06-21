from django.db import transaction

from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


@transaction.atomic()
def mutation_delete_content(*_, id=None):
    res = ContentLine.objects.get(pk=id).delete()
    if res and res[0] > 0:
        return True
    else:
        return False


@transaction.atomic()
def mutation_delete_content_meaning(*_, id=None):
    res = ContentMeaning.objects.get(pk=id).delete()
    if res and res[0] > 0:
        return True
    else:
        return False


@transaction.atomic()
def mutation_update_content(*_, id=None, withData):
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


@transaction.atomic()
def mutation_update_content_meaning(*_, id=None, withData):
    parentEntity = None
    contentMeaningObj = None

    # check for Parent Entity
    parentId = withData.get('parentEntity')
    if parentId:
        parentEntity = Entity.objects.get(pk=parentId)
    if not parentEntity:
        return Exception(f"Parent Entity {parentId} does not exist")

    if not id:
        if parentId:
            try:
                # check if same language content already available
                contentMeaningObj = ContentMeaning.objects.filter(
                    parent=parentId, language=withData.get('language'))[0]
            except Exception:
                # create content of the new Entity
                contentMeaningObj = ContentMeaning()

    else:
        contentMeaningObj = ContentMeaning.objects.get(pk=id)

    contentMeaningObj.language = Language(withData.get('language'))
    contentMeaningObj.content = withData.get('content')

    if parentEntity:
        contentMeaningObj.parent = parentEntity

    contentMeaningObj.save()

    return contentMeaningObj
