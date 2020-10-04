import json
import sys
import getopt

from python_graphql_client import GraphqlClient

DANDAM = '।'
DANDAM_2 = '॥'


qry_fetch_base_types = """
    query {
      entityTypes{
        id
        name
      }
      languages{
        id
        iso
      }
    }
"""
qry_search_entity_by_type = """
query searchEntitiesByDefaultText($text:String!,$type:ID!){
  entities(by:{text:$text, type:$type}){
    id
    defaultText
  }
}
"""

mutation_update_entity = """
mutation updateEntity($id:ID,$entityData: EntityContentInput!) {
  updatedEntity:updateEntityContent(id:$id, withData: $entityData) {
    id
    defaultText
  }
}
"""

mutation_create_entity = """
mutation createEntity($entityData: EntityContentInput!) {
  newEntity:updateEntityContent(withData: $entityData) {
    id
    defaultText
  }
}
"""

# "variables":{"withData":{"parentEntity":"34393","content":"IAST content","language":"5"}},
mutation_create_content = """
mutation UpdateContent($withData: ContentLineInput) {
    updateContent(withData: $withData) {
        id
        language {
            id
        }
    }
}
"""
mutation_create_content_meaning = """
mutation UpdateContentMeaning($withData: ContentMeaningInput) {
    updateContentMeaning(withData: $withData) {
        id
        language {
            id
        }
    }
}
"""


class EntityContentLoader():

    def __init__(self, client):
        self.client = client
        self.parent_type = 'God'
        self.entity_type = 'Stotram'
        self.content_type = 'Slokam'

        # get base types
        baseData = self.client.execute(query=qry_fetch_base_types)['data']
        self.baseTypes = baseData['entityTypes']
        self.baseLanguages = baseData['languages']

    def load_from_json(self, json_file=None, parent_type=None, entity_type=None, content_type=None):
        with open(json_file, 'r') as f:
            jsonData = json.load(f)

            self.parent_type = parent_type if parent_type else self.parent_type
            self.entity_type = entity_type if entity_type else self.entity_type
            self.content_type = content_type if content_type else self.content_type

            if isinstance(jsonData, list):
                for data in jsonData:
                    self.run(parent_entity_data=data.get('parent'),
                             entity_data=data.get('entity'), content_data=data.get('contents'))
            else:
                self.run(parent_entity_data=jsonData.get('parent'),
                         entity_data=jsonData.get('entity'), content_data=jsonData.get('contents'))

    def run(self, parent_entity_data=None, entity_data=None, content_data=None):
        parentEntity = None
        if parent_entity_data:
            # create parent entity
            parentEntity = self.create_entity(
                parent_entity_data, None, self.parent_type)
            print('Parent Entity: ', parentEntity)

        # create or fetch stotram entity
        entity = self.create_entity(
            entity_data, parentEntity, self.entity_type)
        print('Entity: ', entity)

        if content_data:
            # add slokas to the entity
            if content_data.get('file'):
                self.add_content_from_file(
                    file=content_data['file'], data=content_data, parent=entity)
            else:
                self.add_contents(data=content_data, parent=entity)

    def add_contents(self, data=None, parent=None, skip_existence_check=False):
        for languageKey in data.keys():  # for each language of contents
            if not self.get_language_by_iso(languageKey):
                continue
            languageContent = data[languageKey]
            # print(languageContent)
            contentInfo = {
                'type': languageContent.get('type', data.get('type', self.content_type)),
                'language': languageKey,
            }

            meanings = languageContent.get('meanings', [])
            meanings_len = len(meanings)

            item_counter = 0
            for lines in languageContent['contents']:
                print(lines)
                if item_counter < meanings_len:
                    meaning_lines = meanings[item_counter]
                else:
                    meaning_lines = None

                item_counter += 1
                newContent = self.create_entity_content(
                    item_counter, parent, content_info=contentInfo, content_lines=lines, meaning_lines=meaning_lines, skip_existence_check=skip_existence_check)
                if not newContent:
                    return Exception('content not created')
                else:
                    # print('content created: ', newContent)
                    pass
        pass

    def add_content_from_file(self, file=None, data=None, parent=None, skip_existence_check=False):
        f = open(file)
        line = f.readline()
        append_dandam = bool(data.get('append_dandam', False))
        item_counter = 0
        item_lines = ''
        item_line_counter = 0
        lines_per_item = int(data.get('lines_per_item', 0))
        lines_per_item_half = lines_per_item // 2
        while line:
            line = line.rstrip()
            if not line:
                line = f.readline()
                continue  # line is empty

            item_line_counter += 1
            line_delimeter = ''

            if append_dandam and item_line_counter == lines_per_item_half:
                line_delimeter = ' ' + DANDAM + '\n'
            elif append_dandam and item_line_counter == lines_per_item:
                line_delimeter = ' ' + DANDAM_2 + '\n'
            else:
                line_delimeter = '\n'

            item_lines = item_lines + line + line_delimeter

            if item_line_counter == lines_per_item:
                item_counter += 1
                # print(f'\n-- slokam {item_counter} --\n{item_lines}')

                # create
                newContent = self.create_entity_content(
                    item_counter, parent, content_info=data, content_lines=item_lines, skip_existence_check=skip_existence_check)
                if not newContent:
                    return Exception('content not created')
                else:
                    # print('content created: ', newContent)
                    pass

                item_lines = ''
                item_line_counter = 0

            line = f.readline()

        if item_lines:
            # print(f'\n-- remaining --\n{item_lines}')
            newContent = self.create_entity_content(
                item_counter, parent, content_info=data, content_lines=item_lines, skip_existence_check=skip_existence_check)
            if not newContent:
                return Exception('content not created')
            else:
                # print('content created: ', newContent)
                pass

    def create_entity_content(self, index, parent, content_info, content_lines, meaning_lines, skip_existence_check=False):
        entityData = {
            "text": f'{parent["defaultText"]}_{content_info["type"]}_{index}',
            "type": content_info['type'],
            "order": index,
            # "content": {
            #         content_info['language']: content_lines.replace(
            #             '\n', '  \n')  # hack to get new line in markdown
            # }
        }

        # print('creating content: ', entityData)
        entity = self.create_entity(
            entityData, parent, self.content_type, skip_existence_check=skip_existence_check)
        if not entity:
            return None

        # create content
        # hack to get new line in markdown
        contents = content_lines.replace('\n', '  \n')
        # check if language exist
        lang = self.get_language_by_iso(content_info['language'])
        if not lang:
            print('language not found')
            return None

        contentData = {
            'parentEntity': entity.get('id'),
            'language': lang['id'],
            'content': contents
        }

        # "variables":{"withData":{"parentEntity":"34393","content":"IAST content","language":"5"}},
        print('creating entity content:', contentData)
        # newEntity =
        self.client.execute(
            query=mutation_create_content, variables={'withData': contentData})['data']['updateContent']
        # return newEntity

        # check if meaning language exist
        lang = self.get_language_by_iso(content_info.get(
            'meaningLanguage', content_info.get('language', '')))
        if not lang:
            print('language not found')
            return None

        # create content meaning
        if meaning_lines:
            # hack to get new line in markdown
            contents = meaning_lines.replace('\n', '  \n')

            contentData = {
                'parentEntity': entity.get('id'),
                'language': lang['id'],
                'content': contents
            }

            # "variables":{"withData":{"parentEntity":"34393","content":"IAST content","language":"5"}},
            print('creating entity meaning:', contentData)
            # newEntity =
            self.client.execute(
                query=mutation_create_content_meaning, variables={'withData': contentData})['data']['updateContentMeaning']
            # return newEntity

        return entity

    def get_entity_by_name(self, name, typeName):
        entityType = self.get_type_by_name(typeName)
        variables = {'text': name, 'type': entityType['id']}
        try:
            entity = self.client.execute(
                query=qry_search_entity_by_type, variables=variables)['data']['entities'][0]
            return entity
        except Exception:
            return None

    def update_entity(self, entityData, parentEntity=None):
        if not entityData['id']:
            return None

        # prepare text data
        textDatas = entityData.get('textData', {})
        textData = []
        for textKey in textDatas.keys():
            # check if language exist
            lang = self.get_language_by_iso(textKey)
            if not lang:
                print(f'language {textKey} not found')
                continue
            text = {
                'language': lang['id'],
                'text': entityData['textData'][textKey]['text']
            }
            textData.append(text)

        contents = entityData.get('content', {})
        contentData = []
        for contentKey in contents.keys():
            # check if language exist
            lang = self.get_language_by_iso(contentKey)
            if not lang:
                print(f'language {contentKey} not found')
                continue
            text = {
                'language': lang['id'],
                'content': entityData['content'][contentKey]
            }
            contentData.append(text)

        entityDataUpd = {}

        if parentEntity:
            entityDataUpd['parentId'] = parentEntity['id']
        if entityData.get('type', None):
            entityDataUpd['type'] = parentEntity['type']
        if entityData.get('text', None):
            entityDataUpd['defaultText'] = parentEntity['text']
        if entityData.get('order', None):
            entityDataUpd['order'] = parentEntity['order']
        if len(textData) > 0:
            entityDataUpd['textData'] = textData
        if len(contentData) > 0:
            entityDataUpd['contentData'] = content_data

        print('updating entity with:', entityDataUpd)
        entity = self.client.execute(
            query=mutation_update_entity, variables={'id': entityData['id'], 'entityData': entityDataUpd})['data']['updatedEntity']
        return entity

    def create_entity(self, entityData, parentEntity=None, entityTypeName=None, skip_existence_check=False):

        if not skip_existence_check:
            # check if the entity already exist
            entity = self.get_entity_by_name(
                entityData['text'], entityData.get('type', entityTypeName))
            if entity:
                return entity

        # get entity type
        entityType = self.get_type_by_name(
            entityData.get('type', entityTypeName))
        if not entityType:
            return None

        # prepare text data
        textDatas = entityData.get('textData', {})
        textData = []
        for textKey in textDatas.keys():
            # check if language exist
            lang = self.get_language_by_iso(textKey)
            if not lang:
                print(f'language {textKey} not found')
                continue
            text = {
                'language': lang['id'],
                'text': entityData['textData'][textKey]['text']
            }
            textData.append(text)

        contents = entityData.get('content', {})
        contentData = []
        for contentKey in contents.keys():
            # check if language exist
            lang = self.get_language_by_iso(contentKey)
            if not lang:
                print(f'language {contentKey} not found')
                continue
            text = {
                'language': lang['id'],
                'content': entityData['content'][contentKey]
            }
            contentData.append(text)

        entityData = {
            'parentId': parentEntity['id'] if parentEntity else None,
            'type': entityType['id'],
            'defaultText': entityData['text'],
            'order': entityData.get('order', 0),
            'textData': textData,
            'content': contentData,
        }
        print('creating entity with:', entityData)
        newEntity = self.client.execute(
            query=mutation_create_entity, variables={'entityData': entityData})['data']['newEntity']
        return newEntity

    def get_type_by_name(self, typeName):
        for baseType in self.baseTypes:
            if baseType['name'] == typeName:
                return baseType
        return None

    def get_language_by_iso(self, languageIso):
        for language in self.baseLanguages:
            if language['iso'] == languageIso:
                return language
        return None


# usage
# $> python entity_content_loader.py -i "./data/contents.json" -u "https://host/graphql/"
if __name__ == "__main__":
    inputfile = ''
    url = "http://localhost:8000/graphql/"
    headers = {}

    try:
        opts, args = getopt.getopt(sys.argv[1:], "hi:u:p:e:c:k:", [
                                   "ifile=", "url=", "skip-existance-check=", "parent-type=", "entity-type=", "content-type=", "key="])
    except getopt.GetoptError:
        print('slokas_with_lines.py -i <inputfile> -u <url>')
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print('slokas_with_lines.py -i <inputfile> -u <url>')
            sys.exit()
        elif opt in ("-u", "--url"):
            url = arg
            if not url:
                url = "http://localhost:8000/graphql/"
                print(f'missing url server url, using {url}')
        elif opt in ("-i", "--ifile"):
            inputfile = arg
            if not inputfile:
                print('missing -i <inputfile>')
                print('slokas_with_lines.py -i <inputfile>')
                sys.exit(2)
        elif opt in ("-p", "--parent-type"):
            parent_type = arg
        elif opt in ("-e", "--entity-type"):
            entity_type = arg
        elif opt in ("-c", "--content-type"):
            content_type = arg
        elif opt in ("-k", "--key"):
            headers["Secretkey"] = arg

    print('Destination URL "', url)
    print('Input file is "', inputfile)

# initiate the client
    client = GraphqlClient(endpoint=url, headers=headers)
# data from json file
    EntityContentLoader(client).load_from_json(inputfile)

# Sample JSON format

    # {
    #     "parent": {
    #         "text": "Hanuman",
    #         # optional (if provided with command line argument, else defaults to 'God')
    #         "type": "God",
    #         "textData": {
    #             "TEL": {
    #                 "text": "హనుమాన్"
    #             },
    #             "SAN": {
    #                 "text": "हनुमान्"
    #             }
    #         }
    #     },
    #     "entity": {
    #         "text": "Hanuman Chalisa (Tulsidas)",
    #         # optional (if provided with command line argument, else defaults to 'Stotram')
    #         "type": "Stotram",
    #         "textData": {
    #             "TEL": {
    #                 "text": "హనుమాన్ చాలీసా (తులసీదాస కృతం)"
    #             },
    #             "SAN": {
    #                 "text": "हनुमान चालीसा"
    #             }
    #         }
    #     },
    #     "contents": {
    #         # optional (if provided with command line argument, else defaults to 'Slokam')
    #         "type": "Slokam",
    #         "TEL": {
    #             "language": "TEL",
    #             "title": "హనుమాన్ చాలీసా (తులసీదాస కృతం)",
    #             "category": "హనుమాన్",
    #             "source": "https://stotranidhi.com/hanuman-chalisa-in-telugu/",
    #             "contents": [
    #                 "దోహా-\nశ్రీ గురు చరణ సరోజ రజ \nనిజమన ముకుర సుధారి\nవరణౌ రఘువర విమల యశ \nజో దాయక ఫలచారి ||",
    #             ]
    #         }
    #     }
    # }


# Sample Flatfile format (depricated)
    # content_data = {
    #     'language': 'SAN',
    #     'type': 'Slokam',
    #     'file': 'data/hanuman_chalisa.txt',
    #     'lines_per_item': 2,
    #     'merge_lines_to': 0,
    #     'append_dandam': True,
    #     'append_index': True
    # }
    # parent_entity_data = {
    #     "text": 'Hanuman',
    #     "type": 'God'
    # }
    # entity_data = {
    #     "text": "Hanuman Chalisa",
    #     "type": "Stotram",
    #     "textData": {
    #         "SAN": {
    #             "text": "हनुमान् चालीसा"
    #         },
    #         "TEL": {
    #             "text": "హనుమాన్ చాలీసా"
    #         },
    #         "TAM": {
    #             "text": "ஹநுமாந் சாலீஸா"
    #         },
    #         "IAST": {
    #             "text": "hanumān cālīsā"
    #         },
    #         "SLP1": {
    #             "text": "hanumAn cAlIsA"
    #         }
    #     }
    # }
