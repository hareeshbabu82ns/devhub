const { Query, Document, FilterQuery } = require('mongoose');

const FilterOperation = {
  Equals: 'EQUALS',
  NotEquals: 'NOT_EQUALS',
  In: 'IN',
  NotIn: 'NOT_IN',
  LessThan: 'LESS_THAN',
  LessThanEquals: 'LESS_THAN_EQUALS',
  GreaterThan: 'GREATER_THAN',
  GreaterThanEquals: 'GREATER_THAN_EQUALS',
  Regex: 'REGEX',
  All: 'ALL',
}
function getRequestedFields(info) {
  const selections = info.fieldNodes[0]?.selectionSet?.selections;
  // console.log('Requested Fields: ', selections);

  const names = [];
  selections.forEach(({ name: { value } }) => names.push(value));
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

function buildQueryFilter(
  query,
  filters) {

  const keys = Object.keys(filters);
  var queryTmp = query
  keys.forEach((key) => {

    const value = filters[key];

    if (key in queryFilterLogicalMap) {
      const filter = [];
      value.forEach((filterCondition) => {
        const q = new Query();
        buildQueryFilter(q, filterCondition);
        filter.push(q.getFilter());
      });
      // queryTmp = queryTmp.and(filter);
      queryTmp = queryFilterLogicalMap[key].apply(queryTmp, [filter]);
    }

    const path = key === 'id' ? '_id' : value.path ? `${key}.${value.path}` : key

    queryTmp = queryTmp.where(path)
    // console.log(value)

    if ('operation' in value) {
      const valueOperation = value['operation'];
      const valueValue = value['value'];
      const valueValueList = value['valueList'];
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
    // query.where(key).equals(filters[key]);
  });
}

module.exports = {
  getRequestedFields,
  buildQueryFilter
}