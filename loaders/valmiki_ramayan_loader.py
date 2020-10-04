from python_graphql_client import GraphqlClient
import json
from entity_content_loader import EntityContentLoader

languageSlokam = 'SAN'
languageMeaning = 'ENG'

KANDAS = ['baala', 'ayodhya', 'aranya', 'kish', 'sundara', 'yuddha']
KANDAS_DATA = [{'code': 'baala', 'sargas': 77, 'title': 'Bala Kanda', 'descr': 'The Youthful Majesties'},
               {'code': 'ayodhya', 'sargas': 119, 'title': 'Ayodhya Kanda', 'descr': 'Book Of Ayodhya'}, {'code': 'aranya', 'sargas': 75, 'title': 'Aranya Kanda', 'descr': 'The Forest Trek'}, {
    'code': 'kish', 'sargas': 67, 'title': 'Kishkindha Kanda', 'descr': 'The Empire of Holy Monkeys'}, {'code': 'sundara', 'sargas': 68, 'title': 'Sundara Kanda', 'descr': 'Book Of Beauty'}, {'code': 'yuddha', 'sargas': 128, 'title': 'Yuddha Kanda', 'descr': 'Book Of War'}]
SARGA_DELIMITER = '_sarga_'

# create god
god_data = {
    "text": "Raama",
    "type": "God",
    "textData": {
        "TEL": {
            "text": "రామ"
        },
        "SAN": {
            "text": "राम"
        },
        "IAST": {
            "text": "rāma"
        }
    }
}
epic_data = {
    "text": "Ramayanam",
    "type": "Puranam",
    "textData": {
        "TEL": {
            "text": "రామాయణమ్"
        },
        "SAN": {
            "text": "रामायणम्"
        },
        "IAST": {
            "text": "rāmāyaṇam"
        },
        "SLP1": {
            "text": "rAmAyaRam"
        }
    }
}


def run(out_dir='./data/valmiki_ramayan'):
    url = "http://localhost:8000/graphql/"
    # url = "http://192.168.0.31:23842/graphql/"  # only for loading to Prod

    headers = {}
    # only for loading to Prod
    headers["Secretkey"] = '(e4lq7e@r97ygh#2@8c0qx4p7t6xs96h4vcv@k&$7k)4oo@&at'

# initiate the client
    client = GraphqlClient(endpoint=url, headers=headers)
# data from json file
    loader = EntityContentLoader(client)
    god_entity = loader.create_entity(entityData=god_data)
    print('God Created: ', god_entity)

    puranam_entity = loader.create_entity(
        entityData=epic_data, parentEntity=god_entity)
    print('Epic Created: ', puranam_entity)

    for index, kanda in enumerate(KANDAS_DATA):
        kanda_data = {
            "text": kanda.get('title'),
            "type": 'Kaandam',
            "description": kanda.get('descr'),
            "order": index + 1
        }
        kanda_entity = loader.create_entity(
            entityData=kanda_data, parentEntity=puranam_entity)
        if kanda_entity['id'] > puranam_entity['id']:
            print('Kanda Created: ', kanda_entity)
        else:  # kanda already exists
            print(
                f'Kanda {kanda_entity["id"]} Updated with parent {puranam_entity["id"]}')
            kanda_rel = {
                'id': kanda_entity['id']
            }
            kanda_entity = loader.update_entity(
                entityData=kanda_rel, parentEntity=puranam_entity)

        for sarga_index in range(1, kanda.get('sargas', 0) + 1):
            # for sarga_index in range(kanda.get('sargas', 0), kanda.get('sargas', 0)+1):
            sarga_data = {
                "text": kanda.get('title') + SARGA_DELIMITER + str(sarga_index),
                "type": "Sarga",
            }

            json_file = out_dir + '/' + kanda.get(
                'code') + SARGA_DELIMITER + str(sarga_index) + '.json'
            print(f'Parsing Sarga File: {json_file}')
            with open(json_file, 'r') as f:
                jsonData = json.load(f)
                json_contents = jsonData.get('contents', [])
                if len(json_contents) > 0:
                    sarga_entity = loader.create_entity(
                        entityData=sarga_data, parentEntity=kanda_entity, skip_existence_check=False)
                    print('Sarga Created: ', sarga_entity['id'],
                          sarga_entity['defaultText'])

                for slokam_index, json_content in enumerate(json_contents):
                    contentInfo = {
                        'type': 'Slokam',
                        'language': "SAN",
                        'meaningLanguage': "ENG",
                    }
                    meaning_lines = json_content.get(
                        'tatparyam', '') + '\n**Prathi Pada Ardhamu**\n' + json_content.get('prati_pada_artham', '')
                    slokam_entity = loader.create_entity_content(
                        slokam_index, sarga_entity, content_info=contentInfo, meaning_lines=meaning_lines,
                        content_lines=json_content.get('slokam'), skip_existence_check=False)
                    print('Slokam Created: ', slokam_entity['id'],
                          slokam_entity['defaultText'])
                    break  # for testing only

            break  # for testing only


if __name__ == "__main__":
    run()
