const UserModel = require('./src/db/models/User');
const EntityModel = require('./src/db/models/Entity');
const EntityTypeModel = require('./src/db/models/EntityType');
const LanguageModel = require('./src/db/models/Language');

async function cleanupCollections() {
  await UserModel.deleteMany({})
  await EntityTypeModel.deleteMany({})
  await LanguageModel.deleteMany({})
  await EntityModel.deleteMany({})
}

module.exports = {
  cleanupCollections,
}