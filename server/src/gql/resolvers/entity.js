const mongoose = require('mongoose')
const EntityModel = require('../../db/models/Entity');

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
  const text = languageValuesToMap(data.text)
  const itemData = {
    type: data.type,
    text,
  }

  // check [children] data
  if (data.children && data.children.length > 0) {
    // create each child
    itemData.children = data.children.map(async (child) => createEntityWithData(child))
      .map(child => child.id)
  }

  console.log(itemData)
  const item = await EntityModel.create(itemData)
  console.log(item)
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
  read: async () => {
    const res = await EntityModel.find();
    return res.map(item => {
      console.log(item)
      const type = {
        id: item.id,
        type: item.get('type'),
        text: item.get('text'),
      }
      return type;
    });
  },
  update: async (id, data) => {
    const item = await EntityModel.findOneAndUpdate({ "_id": id }, data);
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await createEntityWithData(data)
    return item.id;
  },
  delete: async (id) => {
    const item = await EntityModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      return null;
  },
}