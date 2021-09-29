const mongoose = require('mongoose')
const EntityModel = require('../../db/models/Entity');
const { buildQueryFilter } = require('./utils');


const LANGUAGE_DEFAULT_INPUT = "DEFAULT"
const LANGUAGE_DEFAULT_ISO = "SAN"

async function getEntityType({ id, name }) {
  const EntityTypeModel = mongoose.model('EntityType')
  if (id)
    return EntityTypeModel.findById(id)

  return EntityTypeModel.findOne({ name })
}

function languageValuesToMap(languageValues) {
  return languageValues.reduce((p, c) => ({ ...p, [c.language]: c.value }), {})
}

async function createEntityWithData(data) {
  const itemData = mapInputToModel(data)

  // check [children] data
  if (data.children && data.children.length > 0) {
    // create each child
    const allAsyncs = data.children.map(async (child) => createEntityWithData(child))
    itemData.children = (await Promise.all(allAsyncs)).map(child => child.id)
  }

  // console.log(itemData)
  const item = await EntityModel.create(itemData)
  // console.log(item)
  return item
}

module.exports = {
  type: {
    Entity: {
      text: async (parent, { language }) => {
        return parent.text[language === LANGUAGE_DEFAULT_INPUT ? LANGUAGE_DEFAULT_ISO : language]
      }
    }
  },
  read: async (args, requestedFields) => {
    const query = EntityModel.find();

    if (args.by) {
      buildQueryFilter(query, args.by);
    }
    query.limit(args.limit);

    query.select(requestedFields.join(' '));
    const res = await query.exec();
    return res.map(mapModelToGQL);
  },
  update: async (id, data) => {
    const itemData = mapInputToModel(data)
    const item = await EntityModel.findOneAndUpdate({ "_id": id }, { $set: { ...itemData } });
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await createEntityWithData(data)
    return item.id;
  },
  delete: async (id) => {
    const item = await EntityModel.deleteOne({ "_id": id });
    // console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      throw `Nothing deleted with matching id: ${id}`;
  },
}

const mapModelToGQL = (item) => {
  // console.log(item.toJSON())
  const type = {
    id: item.id,
    type: item.get('type'),
    text: item.get('text'),
  }
  return type;
}

const mapInputToModel = (item) => {
  // console.log(item.toJSON())
  const text = languageValuesToMap(item.text)
  const itemData = {
    type: item.type,
    text,
  }
  return itemData;
}