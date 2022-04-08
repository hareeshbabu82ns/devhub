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

module.exports = {
  LanguageTextSchema
}