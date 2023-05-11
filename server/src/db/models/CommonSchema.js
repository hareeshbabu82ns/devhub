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

const AttributesSchema = new mongoose.Schema( {
  key: {
    type: String,
    required: "Attribute Key is required",
  },
  value: {
    type: String,
    required: "Attribute Value is required",
  },
} )

module.exports = {
  LanguageTextSchema,
  AttributesSchema,
}