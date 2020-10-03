from python_graphql_client import GraphqlClient
import json
from entity_content_loader import EntityContentLoader

languageSlokam = 'SAN'
languageMeaning = 'ENG'

HOME_PAGE_URL = 'http://telugubhagavatam.org/?tebha'
SKANDAS = ['1', '2', '3', '4', '5.1', '5.2', '6',
           '7', '8', '9', '10.1', '10.2', '11', '12']
# SKANDA_PAGES = ['bala', 'ayodhya', 'aranya', 'kishkindha', 'sundara', 'yuddha']
# GHATTAS = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 199, 92, 20, 14]
GHATTAS = [42, 37, 58, 29, 17, 9, 18, 18, 94, 55, 199, 92, 20, 14]

SKANDAS_DATA = [{'code': 'first', 'sargas': 42,
                 'title': 'First Skandham', 'descr': ''},
                {'code': 'second', 'sargas': 37,
                 'title': 'Second Skandham', 'descr': ''},
                {'code': 'third', 'sargas': 58,
                 'title': 'Third Skandham', 'descr': ''},
                {'code': 'forth', 'sargas': 29,
                 'title': 'Forth Skandham', 'descr': ''},
                {'code': 'fifth1', 'sargas': 17,
                 'title': 'Fifth1 Skandham', 'descr': ''},
                {'code': 'fifth2', 'sargas': 9,
                 'title': 'Fifth2 Skandham', 'descr': ''},
                {'code': 'sixth', 'sargas': 18,
                 'title': 'Sixth Skandham', 'descr': ''},
                {'code': 'seventh', 'sargas': 18,
                 'title': 'Seventh Skandham', 'descr': ''},
                {'code': 'eighth', 'sargas': 94,
                 'title': 'Eighth Skandham', 'descr': ''},
                {'code': 'nineth', 'sargas': 55,
                 'title': 'Nineth Skandham', 'descr': ''},
                {'code': 'tenth1', 'sargas': 199,
                 'title': 'Tenth1 Skandham', 'descr': ''},
                {'code': 'tenth2', 'sargas': 92,
                 'title': 'Tenth2 Skandham', 'descr': ''},
                {'code': 'eleven', 'sargas': 20,
                 'title': 'Eleven Skandham', 'descr': ''},
                {'code': 'twelth', 'sargas': 14,
                 'title': 'Twelth Skandham', 'descr': ''}, ]
SKANDAM_DELIMITER = 'skandam_'
GHATTAM_DELIMITER = '_ghattam_'

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
    "text": "Pothana Bhagavatham",
    "type": "Puranam",
    "textData": {
            "TEL": {
                "text": "పోతన భాగవతం"
            },
        "SAN": {
                "text": "पोतन भागवतं"
                },
        "IAST": {
                "text": "potana bhāgavataṃ"
                },
        "SLP1": {
                "text": "potana BAgavataM"
                }
    }
}


def run(out_dir='./data/pothana_bhagavatham'):
    url = "http://localhost:8000/graphql/"
    # url = "http://192.168.0.31:23842/graphql/" # only for loading to Prod

    headers = {}
    # only for loading to Prod
    # headers["Secretkey"] = '(e4lq7e@r97ygh#2@8c0qx4p7t6xs96h4vcv@k&$7k)4oo@&at'

# initiate the client
    client = GraphqlClient(endpoint=url, headers=headers)
# data from json file
    loader = EntityContentLoader(client)
    god_entity = loader.create_entity(entityData=god_data)
    print('God Created: ', god_entity)

    puranam_entity = loader.create_entity(
        entityData=epic_data, parentEntity=god_entity)
    print('Epic Created: ', puranam_entity)

    for index, kanda in enumerate(SKANDAS_DATA):
        kanda_data = {
            "text": kanda.get('title'),
            "type": 'Kaandam',
            "description": kanda.get('descr'),
            "order": index + 1
        }
        kanda_entity = loader.create_entity(
            entityData=kanda_data, parentEntity=puranam_entity)
        print('Kanda Created: ', kanda_entity)

        for sarga_index in range(1, kanda.get('sargas', 0)):
            # for sarga_index in range(kanda.get('sargas', 0), kanda.get('sargas', 0)+1):
            sarga_data = {
                "text": kanda.get('title') + GHATTAM_DELIMITER + str(sarga_index),
                "type": "Sarga",
                "order": sarga_index,
            }

            json_file = out_dir + '/' + SKANDAM_DELIMITER + \
                SKANDAS[index] + GHATTAM_DELIMITER+str(sarga_index)+'.json'
            print(f'Parsing Sarga File: {json_file}')
            try:
                with open(json_file, 'r') as f:
                    jsonData = json.load(f)
                    json_contents = jsonData.get('contents', [])
                    if len(json_contents) > 0:
                        sarga_data['textData'] = {
                            'TEL': {'text': jsonData.get('sargaTitle', '')}}
                        sarga_entity = loader.create_entity(
                            entityData=sarga_data, parentEntity=kanda_entity, skip_existence_check=True)
                        print('Sarga Created: ', sarga_entity['id'],
                              sarga_entity['defaultText'])

                    for slokam_index, json_content in enumerate(json_contents):
                        contentInfo = {
                            'type': 'Slokam',
                            'language': "TEL",
                            'meaningLanguage': "TEL",
                        }
                        meaning_lines = json_content.get(
                            'tatparyam', '') + '\n**ప్రతిపదార్ధము**\n' + json_content.get('prati_pada_artham', '')
                        slokam_entity = loader.create_entity_content(
                            slokam_index, sarga_entity, content_info=contentInfo,
                            content_lines=json_content.get('slokam'), meaning_lines=meaning_lines, skip_existence_check=False)
                        print('Slokam Created: ', slokam_entity['id'],
                              slokam_entity['defaultText'])
                        break  # for testing only
            except:
                pass  # try next file

            break  # for testing only


if __name__ == "__main__":
    run()
