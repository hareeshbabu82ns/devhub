# schema.py

from ariadne.contrib.django.scalars import date_scalar, datetime_scalar
from ariadne import load_schema_from_path, make_executable_schema, snake_case_fallback_resolvers

from devhub.gql_root_types import query, mutation
from gql_api.models import EntityType
from gql_api.schema import types as api_types


type_defs = load_schema_from_path("devhub/schema.graphql")


schema = make_executable_schema(
    type_defs, query, mutation, *api_types, snake_case_fallback_resolvers)
