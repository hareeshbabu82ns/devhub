import json
from django.db import transaction
from gql_api.models import Entity, EntityRelation, EntityMeta, EntityText, EntityType, Language, ContentLine, ContentMeaning, ContentExtras


@transaction.atomic()
def run():
    baseTypes = EntityType.objects.all()
    baseLanguages = Language.objects.all()

    godType = get_type_by_name(baseTypes, 'God')
    if not godType:
        return Exception('God Type not found')

    with open('gql_api/scripts/gods.json') as f:
        godsData = json.load(f)

    for god in godsData:
        # check if entity exists
        try:
            entity = Entity.objects.filter(default_text=god['text'])[0]
        except Exception:
            entity = None

        if not entity:
            print('creating god:', god['text'])
            entity = Entity()
            entity.default_text = god['text']
            entity.type = godType
            entity.save()
        else:
            print('updating god:', god['text'])

        # fetch current texts
        entityTexts = EntityText.objects.filter(parent_id=entity.id)

        for textKey in god['textData'].keys():
            # check if language exist
            lang = get_language_by_iso(baseLanguages, textKey)
            if not lang:
                print(f'language {textKey} not found')
                continue

            entityText = get_text_by_lang(entityTexts, lang.id)
            if entityText:
                print('updating text:', textKey)
            else:
                print('creating text:', textKey)
                entityText = EntityText()
                entityText.parent = entity
                entityText.type = godType
                entityText.language = lang

            entityText.text = god['textData'][textKey]['text']
            entityText.save()


def get_text_by_lang(textDatas, langId):
    for textData in textDatas:
        if textData.language.id == langId:
            return textData
    return None


def get_type_by_name(baseTypes, typeName):
    for baseType in baseTypes:
        if baseType.name == typeName:
            return baseType
    return None


def get_language_by_iso(languages, languageIso):
    for language in languages:
        if language.iso == languageIso:
            return language
    return None


if __name__ == "__main__":
    run()
