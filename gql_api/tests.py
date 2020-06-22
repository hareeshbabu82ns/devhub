from django.test import TestCase, Client

from gql_api.models import EntityType, Entity, Language, EntityRelation, EntityText, EntityMeta, ContentLine, ContentExtras, ContentMeaning


class EntityTestCase(TestCase):
    fixtures = ['init_data.json']

    # class setup
    @classmethod
    def setUpTestData(cls):
        pass

    # each test method setup
    def setUp(self):
        pass

    def test_god_create(self):
        test = Entity.objects.get(id='1')
        resp = self.client.post(
            '/graphql/', {"operationName": '', "variables": {}, "query": "{\n  entities(by: {id: \"1\"}) {\n    id\n    defaultText\n  }\n}\n"}, content_type='application/json')
        json = resp.json()
        # print(json)
        self.assertEqual(test.default_text, json.get(
            'data').get('entities')[0].get('defaultText'))
