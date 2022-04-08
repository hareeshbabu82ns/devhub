const mongoose = require( 'mongoose' );
const { LANGUAGE_DEFAULT_ISO } = require( '../constants' );
const { LanguageTextSchema } = require( './CommonSchema' );

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

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    text: {
      type: [ LanguageTextSchema ],
      required: "Text Data is required",
      validate: {
        validator: ( text ) => {
          // console.log( 'text validator:', text )

          // check if default language is present
          return !!text.find( e => e.get( 'lang' ) === LANGUAGE_DEFAULT_ISO )
        },
        message: props => `Invalid Text Language - Value list`
      }
    },
    parents: {
      type: [ TypeEntitiesSchema ],
    },
    children: {
      type: [ TypeEntitiesSchema ],
    },
    // parents: mongoose.Schema.Types.Mixed,
    // children: mongoose.Schema.Types.Mixed

  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

schema.post( 'save', async ( doc ) => {
  // console.log( 'post save:', doc.toJSON() )
} )

const Entity = mongoose.model( 'Entity', schema, 'Entities' );

module.exports = Entity;