import { GraphQLResolveInfo, FieldNode } from 'graphql';
import { Query, Document, FilterQuery } from 'mongoose';
import { FilterOperation } from '../schema';

export function getRequestedFields(info: GraphQLResolveInfo): Array<String> {
  const selections = info.fieldNodes[0]?.selectionSet?.selections;
  // console.log('Requested Fields: ', selections);

  const names: Array<String> = [];
  selections.forEach(({ name: { value } }: FieldNode) => names.push(value));
  return names;
}

const queryFilterMap = {
  [FilterOperation.Equals]: Query.prototype.equals,
  [FilterOperation.NotEquals]: Query.prototype.ne,
  [FilterOperation.In]: Query.prototype.in,
  [FilterOperation.NotIn]: Query.prototype.nin,
  [FilterOperation.LessThan]: Query.prototype.lt,
  [FilterOperation.LessThanEquals]: Query.prototype.lte,
  [FilterOperation.GreaterThan]: Query.prototype.gt,
  [FilterOperation.GreaterThanEquals]: Query.prototype.gte,
  [FilterOperation.Regex]: Query.prototype.regex,
  [FilterOperation.All]: Query.prototype.all,
}

const queryFilterLogicalMap = {
  'and': Query.prototype.and,
  'or': Query.prototype.or,
  'nor': Query.prototype.nor,
}

export function buildQueryFilter(
  query: Query<Document<any, any>[], Document<any, any>, {}>,
  filters: any) {

  const keys = Object.keys(filters);
  var queryTmp = query
  keys.forEach((key) => {

    const value = filters[key as keyof typeof filters];

    if (key in queryFilterLogicalMap) {
      const filter: FilterQuery<Document<any, any>>[] = [];
      value.forEach((filterCondition: any) => {
        const q = new Query<Document<any, any>[], Document<any, any>, {}>();
        buildQueryFilter(q, filterCondition);
        filter.push(q.getFilter());
      });
      // queryTmp = queryTmp.and(filter);
      queryTmp = queryFilterLogicalMap[key as keyof typeof queryFilterLogicalMap].apply(queryTmp, [filter]);
    }

    const path = key === 'id' ? '_id' : value.path ? `${key}.${value.path}` : key

    queryTmp = queryTmp.where(path)
    // console.log(value)

    if ('operation' in value) {
      const valueOperation = value['operation' as keyof typeof value] as FilterOperation;
      const valueValue = value['value' as keyof typeof value];
      const valueValueList = value['valueList' as keyof typeof value];
      // console.log(valueOperation)

      switch (valueOperation) {
        case FilterOperation.In:
        case FilterOperation.NotIn:
          if (valueValueList)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [valueValueList]);
          else
            throw `valueList missing for ${key} - ${valueOperation}`
          break;
        case FilterOperation.Regex:
          if (valueValue)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [new RegExp(valueValue, 'i')]);
          else
            throw `value missing for ${key} - ${valueOperation}`
          break;
        default:
          if (valueValue)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [valueValue]);
          else
            throw `value missing for ${key} - ${valueOperation}`
          break;
      }
    }
    // query.where(key).equals(filters[key as keyof typeof filters]);
  });
}