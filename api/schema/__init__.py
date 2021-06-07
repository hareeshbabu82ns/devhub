from ariadne import load_schema_from_path, make_executable_schema

from .Query import query
from .Mutation import mutation

type_defs = load_schema_from_path("api/schema")

type_resolvers = [query, mutation]

schema = make_executable_schema(type_defs, type_resolvers)
