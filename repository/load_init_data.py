from api.database import dbConnection
from repository.devhub_repository import DevhubRepository


def main():
    repository = DevhubRepository(dbConnection)

    repository.createEntity({"test", "test value"})


if __name__ == '__main__':
    main()
