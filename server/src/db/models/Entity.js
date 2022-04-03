const mongoose = require( 'mongoose' )

const LanguageTextSchema = new mongoose.Schema( {
  lang: {
    type: String,
    required: "Language ISO is required",
  },
  value: {
    type: String,
    required: "Text is required",
  },
} )

const TypeEntitiesSchema = new mongoose.Schema( {
  type: {
    type: String,
    required: "Entity Type is required",
  },
  entities: {
    type: [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entity',
      required: "Entity IDs is required",
    } ],
  },
} )

const schema = new mongoose.Schema( {
  type: {
    type: String,
    required: true,
  },
  text: {
    type: [ LanguageTextSchema ],
    required: "Text Data is required",
  },
  parents: {
    type: [ TypeEntitiesSchema ],
  },
  children: {
    type: [ TypeEntitiesSchema ],
  },
  // parents: mongoose.Schema.Types.Mixed,
  // children: mongoose.Schema.Types.Mixed

} );

schema.post( 'save', async ( doc ) => {
  console.log( 'post save:', doc.toJSON() )
} )

const Entity = mongoose.model( 'Entity', schema, 'Entities' );

module.exports = Entity;