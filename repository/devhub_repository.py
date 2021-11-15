from bson.objectid import ObjectId
from pymongo.database import Database


class DevhubRepository(object):

    def __init__(self, db: Database):
        self.db = db

    def createEntity(self, data) -> str:
        if data is not None:
            result = self.db["entities"].insert_one(data)
            if result is not None:
                return result.inserted_id
            else:
                raise Exception("Saving failed")
        else:
            raise Exception("Nothing to save, because data parameter is None")

    # def read(self, project_id=None):
    #     if project_id is None:
    #         return self.database.projects.find({})
    #     else:
    #         return self.database.projects.find({"_id": project_id})

    # def update(self, project):
    #     if project is not None:
    #         # the save() method updates the document if this has an _id property
    #         # which appears in the collection, otherwise it saves the data
    #         # as a new document in the collection
    #         self.database.projects.save(project.get_as_json())
    #     else:
    #         raise Exception(
    #             "Nothing to update, because project parameter is None")

    # def delete(self, project):
    #     if project is not None:
    #         self.database.projects.remove(project.get_as_json())
    #     else:
    #         raise Exception(
    #             "Nothing to delete, because project parameter is None")
