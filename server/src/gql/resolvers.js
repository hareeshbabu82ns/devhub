const UserResolvers = require('./resolvers/user');
const EntityResolvers = require('./resolvers/entity');
const EntityTypeResolvers = require('./resolvers/entity_type');
const LanguageResolvers = require('./resolvers/language');
const { getRequestedFields } = require('./resolvers/utils');

const resolvers = {
  Query: {
    version: (parent, args) => {
      return "v1";
    },
    me: UserResolvers.me,

    // Entity 
    entities: EntityResolvers.read,

    // Entity Type
    entityTypes: EntityTypeResolvers.read,

    // Language Type
    languages: async (parent, args, context, info) => {
      const requestedFields = getRequestedFields(info);
      return LanguageResolvers.read(args, requestedFields);
    },
  },

  Mutation: {
    // initialization logic
    init: async (parent, args) => {
      await UserResolvers.init();
      await EntityTypeResolvers.init();
      await LanguageResolvers.init();
      return "data successfully initialized";
    },

    // Entity
    createEntity: async (parent, args) => {
      const res = await EntityResolvers.create(args.withData);
      return res;
    },
    updateEntity: async (parent, args) => {
      const res = await EntityResolvers.update(args.id, args.withData);
      return res;
    },
    deleteEntity: async (parent, args) => {
      const res = await EntityResolvers.delete(args.id);
      return res;
    },

    // Entity Type
    createEntityType: async (parent, args) => {
      const res = await EntityTypeResolvers.create(args.withData);
      return res;
    },
    updateEntityType: async (parent, args) => {
      const res = await EntityTypeResolvers.update(args.id, args.withData);
      return res;
    },
    deleteEntityType: async (parent, args) => {
      const res = await EntityTypeResolvers.delete(args.id);
      return res;
    },

    // Language Type
    createLanguage: async (parent, args) => {
      const res = await LanguageResolvers.create(args.withData);
      return res;
    },
    updateLanguage: async (parent, args) => {
      const res = await LanguageResolvers.update(args.id, args.withData);
      return res;
    },
    deleteLanguage: async (parent, args) => {
      const res = await LanguageResolvers.delete(args.id);
      return res;
    },
  },

  ...EntityResolvers.type
};

module.exports = resolvers