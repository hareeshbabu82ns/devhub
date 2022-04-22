const { LANGUAGE_DEFAULT_INPUT, LANGUAGE_DEFAULT_ISO } = require( '../../db/constants' )
const EntityTypeModel = require( '../../db/models/EntityType' )
const initData = require( './init_data.json' )
const { buildQueryFilter, mapLanguageValueDocumentToGQL, languageValuesToModel, transliteratedText } = require( './utils' )

const MAP_FIELD_ALIAS = { "nameData": "name" }

const mapInputToModel = ( item ) => {
  // console.log( item )
  const name = transliteratedText( languageValuesToModel( item.name ) )
  const itemData = {
    code: item.code,
    name,
    description: item.description,
  }
  return itemData;
}

const mapModelToGQL = ( item ) => {
  // console.log(item.toJSON())
  const type = {
    id: item.id,
    code: item.get( 'code' ),
    name: item.get( 'name' )?.map( mapLanguageValueDocumentToGQL ),
    description: item.get( 'description' ),
  }
  return type;
}

module.exports = {
  type: {
    EntityType: {
      nameData: async ( { name } ) => {
        return name
      },
      name: async ( { name }, { language } ) => {
        const lang = language === LANGUAGE_DEFAULT_INPUT ? LANGUAGE_DEFAULT_ISO : language

        // const langObj = name.find( e => e.language === lang )
        // return langObj ? langObj.value : name[ 0 ].value
        return ( name.find( e => e.language === lang ) || { value: '' } ).value
      },
    },
  },
  init: async () => {
    // create default entity types
    const asyncList = initData.entityTypes.map( ( { code, name } ) =>
      EntityTypeModel.create( { code, name: transliteratedText( name ) } ) )
    await Promise.all( asyncList )
  },

  read: async ( args, requestedFields ) => {
    const query = EntityTypeModel.find();

    if ( args.by ) {
      buildQueryFilter( query, args.by );
    }
    query.limit( args.limit );

    const rFields = requestedFields.map( f => MAP_FIELD_ALIAS[ f ] || f )
    query.select( rFields.join( ' ' ) );
    const res = await query.exec();
    return res.map( mapModelToGQL );
  },
  update: async ( id, data ) => {
    const itemData = mapInputToModel( data )
    const item = await EntityTypeModel.findOneAndUpdate( { "_id": id }, { $set: { ...itemData } } );
    // console.log(item)
    return item.id;
  },
  create: async ( data ) => {
    const itemData = mapInputToModel( data )
    const item = await EntityTypeModel.create( itemData );
    // console.log(item)
    return item.id;
  },
  delete: async ( id ) => {
    const item = await EntityTypeModel.deleteOne( { "_id": id } );
    // console.log(item)
    if ( item.deletedCount === 1 )
      return id;
    else
      throw `Nothing deleted with matching id: ${id}`;
  },
}