from ariadne import ObjectType
from .Mutation import mutation
from repository.devhub_repository import DevhubRepository

entityType = ObjectType('Entity')


@mutation.field("createEntity")
def resolve_m_create_entity(_, info, withData):
    repository = info.context['repository']
    return repository.createEntity(withData)
