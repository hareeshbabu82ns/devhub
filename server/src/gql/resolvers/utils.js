const { Query, Document, FilterQuery } = require("mongoose");
const Sanscript = require("@indic-transliteration/sanscript");
const _ = require("lodash");
const { LANGUAGE_SCHEME_MAP } = require("../../db/constants");

const FilterOperation = {
  Equals: "EQUALS",
  NotEquals: "NOT_EQUALS",
  In: "IN",
  NotIn: "NOT_IN",
  LessThan: "LESS_THAN",
  LessThanEquals: "LESS_THAN_EQUALS",
  GreaterThan: "GREATER_THAN",
  GreaterThanEquals: "GREATER_THAN_EQUALS",
  Regex: "REGEX",
  All: "ALL",
};
function getRequestedFields(info) {
  const selections = info.fieldNodes[0]?.selectionSet?.selections;
  // console.log('Requested Fields: ', selections);

  const names = getFieldsOfSelections(selections);
  return names;
}
function getFieldsOfSelections(selections) {
  // console.log('Requested Fields: ', selections);
  const names = [];
  selections.forEach((s) => {
    // console.log(s);
    const {
      name: { value },
    } = s;
    names.push(value);

    if (s.selectionSet) {
      // has sub selections
      const subNames = getFieldsOfSelections(s.selectionSet.selections);
      names.push("{", ...subNames, "}");
    }
  });
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
};

const queryFilterLogicalMap = {
  and: Query.prototype.and,
  or: Query.prototype.or,
  nor: Query.prototype.nor,
};

function buildQueryFilter(query, filters) {
  const keys = Object.keys(filters);
  var queryTmp = query;
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

    const path =
      key === "id" ? "_id" : value.path ? `${key}.${value.path}` : key;

    queryTmp = queryTmp.where(path);
    // console.log(value)

    if ("operation" in value) {
      const valueOperation = value["operation"];
      const valueValue = value["value"];
      const valueValueList = value["valueList"];
      const valueValueString = value["valueString"];
      // console.log(valueOperation)

      switch (valueOperation) {
        case FilterOperation.In:
        case FilterOperation.NotIn:
          if (valueValueList)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [
              valueValueList,
            ]);
          else throw `valueList missing for ${key} - ${valueOperation}`;
          break;
        case FilterOperation.Regex:
          if (valueValueString)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [
              new RegExp(valueValueString, "i"),
            ]);
          else if (valueValue)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [
              new RegExp(valueValue, "i"),
            ]);
          else throw `value missing for ${key} - ${valueOperation}`;
          break;
        default:
          if (valueValue)
            queryTmp = queryFilterMap[valueOperation].apply(queryTmp, [
              valueValue,
            ]);
          else throw `value missing for ${key} - ${valueOperation}`;
          break;
      }
    }
    // query.where(key).equals(filters[key]);
  });
}

const mapLanguageValueDocumentToGQL = (item) => {
  // console.log( item.toJSON() )
  const type = {
    id: item.id,
    language: item.get("lang"),
    value: item.get("value"),
  };
  return type;
};

function languageValuesToModel(languageValues) {
  return languageValues?.map((i) => ({ lang: i.language, value: i.value }));
}
// function languageValuesToModel( languageValues ) {
//   return languageValues.reduce( ( p, c ) => ( { ...p, [ c.language ]: c.value } ), {} )
// }

const transliteratedText = (textData) => {
  return textData?.map((t) => {
    if (t.value.startsWith("$transliterateFrom=")) {
      const fromLang = t.value.split("=").pop();
      const from = LANGUAGE_SCHEME_MAP[fromLang] || fromLang;
      const to = LANGUAGE_SCHEME_MAP[t.lang] || t.lang;
      const text = _.find(textData, { lang: fromLang })?.value;
      const resText = Sanscript.t(text, from, to);
      return { lang: t.lang, value: resText };
    }
    return t;
  });
};

module.exports = {
  getRequestedFields,
  buildQueryFilter,

  mapLanguageValueDocumentToGQL,
  languageValuesToModel,

  transliteratedText,
};
