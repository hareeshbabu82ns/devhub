const mongoose = require( 'mongoose' );
const { LANGUAGE_DEFAULT_ISO } = require( '../constants' );
const { LanguageTextSchema } = require( './CommonSchema' );

const schema = new mongoose.Schema( {
  code: { type: String, required: true },
  // name: { type: String, required: true },
  name: {
    type: [ LanguageTextSchema ],
    required: "Name Data is required",
    validate: {
      validator: ( name ) => {
        // console.log( 'name validator:', name )

        // check if default language is present
        return !!name.find( e => e.get( 'lang' ) === LANGUAGE_DEFAULT_ISO )
      },
      message: props => `Invalid Name Language - Value list`
    }
  },
  description: String
} );

const EntityType = mongoose.model( 'EntityType', schema, 'EntityTypes' );

module.exports = EntityType;