const mongoose = require('mongoose')
const EntityModel = require('../../db/models/Entity');
const { buildQueryFilter } = require('./utils');


const LANGUAGE_DEFAULT_INPUT = "DEFAULT"
const LANGUAGE_DEFAULT_ISO = "SAN"

function languageValuesToMap(languageValues) {
  return languageValues.reduce((p, c) => ({ ...p, [c.language]: c.value }), {})
}

async function createEntityWithData({ data, session }) {
  const itemData = mapInputToModel(data)

  // console.log(itemData)
  const item = (await EntityModel.create([itemData], { session }))[0]

  // check [children] data
  if (data.children && data.children.length > 0) {
    // create child entities
    const parentIds = { [itemData.type]: [item.id] }
    const childrenData = data.children.map(c => mapInputToModel({ ...c, parentIds }))
    const childItems = await EntityModel.create(childrenData, { session })

    // update childs to entity
    const childIds = childItems.reduce((p, { id, type }) => ({ ...p, [type]: [...(p[type] || []), id] }), {})
    item.children = childIds
    await item.save({ session })
  }

  // await session.commitTransaction()
  session.endSession()
  // console.log(item)
  return item
}

module.exports = {
  type: {
    Entity: {
      text: async ({ text }, { language }) => {
        return text[language === LANGUAGE_DEFAULT_INPUT ? LANGUAGE_DEFAULT_ISO : language]
      },
      children: async ({ children = {} }, { type = [] }, info) => {
        const query = EntityModel.find()
        const typeKeys = type.length ? Object.keys(children).filter(t => type.includes(t)) : Object.keys(children)
        const childIds = typeKeys.reduce((p, c) => [...p, ...children[c]], [])
        buildQueryFilter(query, { id: { operation: 'IN', valueList: childIds } })
        const res = await query.exec();
        return res.map(mapModelToGQL)
      },
      parents: async ({ parents = {} }, args, info) => {
        const query = EntityModel.find()
        const parentIds = Object.keys(parents).reduce((p, c) => [...p, ...parents[c]], [])
        buildQueryFilter(query, { id: { operation: 'IN', valueList: parentIds } })
        const res = await query.exec();
        return res.map(mapModelToGQL)
      },
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
    const session = await EntityModel.startSession()
    // session.startTransaction() //TODO: needs replicaSet on DB server
    try {
      const item = await createEntityWithData({ data, session })
      return item.id;
    } catch (e) {
      // await session.abortTransaction()
      session.endSession()
      throw e
    }
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
    children: item.get('children'),
    parents: item.get('parents'),
  }
  return type;
}

const mapInputToModel = (item) => {
  // console.log(item.toJSON())
  const text = languageValuesToMap(item.text)
  const itemData = {
    type: item.type,
    text,
    parents: item.parentIds ? { ...item.parentIds } : {},
    children: item.childIds ? { ...item.childIds } : {},
  }
  return itemData;
}