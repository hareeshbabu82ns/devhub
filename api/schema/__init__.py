from ariadne import load_schema_from_path, make_executable_schema

from .Query import query
from .Mutation import mutation

from .sanscript import sanscriptSchemesEnum
from .entities import entityType

type_defs = load_schema_from_path("api/schema")

type_resolvers = [query, mutation, sanscriptSchemesEnum,
                  entityType]

schema = make_executable_schema(type_defs, type_resolvers)
