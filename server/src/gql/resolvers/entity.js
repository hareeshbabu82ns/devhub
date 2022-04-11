const mongoose = require( 'mongoose' );
const { LANGUAGE_DEFAULT_INPUT, LANGUAGE_DEFAULT_ISO } = require( '../../db/constants' );
const EntityModel = require( '../../db/models/Entity' );
const language = require( './language' );
const { buildQueryFilter, mapLanguageValueDocumentToGQL, languageValuesToModel } = require( './utils' )

async function createEntityWithData( { data, session } ) {
  const itemData = mapInputToModel( data )

  // console.log( itemData )
  const item = ( await EntityModel.create( [ itemData ], { session } ) )[ 0 ]

  // TODO: check [childIDs]

  // check [children] data
  if ( data.children && data.children.length > 0 ) {
    // create child entities
    const parentIDs = [ { type: itemData.type, entities: [ item.id ] } ]
    const childrenData = data.children.map( c => mapInputToModel( { ...c, parentIDs } ) )
    const childItems = await EntityModel.create( childrenData, { session } )

    // update childs to entity
    const childIds = childItems.reduce( ( p, { id, type } ) => {
      const i = p.findIndex( e => e.type === type )
      const typeIds = i > 0 ? p[ i ] : { type, entities: [] }
      typeIds.entities.push( id )
      if ( i > 0 )
        p[ i ] = typeIds
      else
        p.push( typeIds )
      return [ ...p ]
    }, [] )

    // console.log( 'child ids: ', childIds )
    item.children = childIds
  }

  // check [parentIDs]
  if ( data?.parentIDs?.length > 0 ) {
    const pIDs = []
    data?.parentIDs.forEach( e => pIDs.push( ...e.entities ) )
    const updatedEntities = await EntityModel.updateMany( { _id: { $in: pIDs } },
      { $push: { children: { type: itemData.type, entities: [ item.id ] } } }, { session } )
    console.log( 'updated parent entities:', updatedEntities )
  }
  // check [parents] data
  if ( data.parents && data.parents.length > 0 ) {
    // create parent entities
    const childIDs = [ { type: itemData.type, entities: [ item.id ] } ]
    const parentsData = data.parents.map( c => mapInputToModel( { ...c, childIDs } ) )
    const parentItems = await EntityModel.create( parentsData, { session } )

    // update parents to entity
    const parentIds = parentItems.reduce( ( p, { id, type } ) => {
      const i = p.findIndex( e => e.type === type )
      const typeIds = i > 0 ? p[ i ] : { type, entities: [] }
      typeIds.entities.push( id )
      if ( i > 0 )
        p[ i ] = typeIds
      else
        p.push( typeIds )
      return [ ...p ]
    }, [] )

    item.parents = parentIds
  }

  // // check [children] data
  // if ( data.children && data.children.length > 0 ) {
  //   // create child entities
  //   const parentIds = { [ itemData.type ]: [ item.id ] }
  //   const childrenData = data.children.map( c => mapInputToModel( { ...c, parentIds } ) )
  //   const childItems = await EntityModel.create( childrenData, { session } )

  //   // update childs to entity
  //   const childIds = childItems.reduce( ( p, { id, type } ) => ( { ...p, [ type ]: [ ...( p[ type ] || [] ), id ] } ), {} )
  //   item.children = childIds
  // }

  await item.save( { session } )
  // console.log(item)
  return item
}

module.exports = {
  type: {
    Entity: {
      text: async ( { text }, { language } ) => {
        // return text[ language === LANGUAGE_DEFAULT_INPUT ? LANGUAGE_DEFAULT_ISO : language ]
        const lang = language === LANGUAGE_DEFAULT_INPUT ? LANGUAGE_DEFAULT_ISO : language

        const langObj = text.find( e => e.language === lang )
        return langObj ? langObj.value : text[ 0 ].value

        // return text.find( e => e.language === lang )?.value
      },
      // children: async ( { children = {} }, { type = [] }, info ) => {
      //   const query = EntityModel.find()
      //   const typeKeys = type.length ? Object.keys( children ).filter( t => type.includes( t ) ) : Object.keys( children )
      //   const childIds = typeKeys.reduce( ( p, c ) => [ ...p, ...children[ c ] ], [] )
      //   buildQueryFilter( query, { id: { operation: 'IN', valueList: childIds } } )
      //   const res = await query.exec();
      //   return res.map( mapModelToGQL )
      // },
      children: async ( { children = [] }, { type = [] }, info ) => {
        const query = EntityModel.find()
        const childIds = []
        const typeKeysChildren = type.length ? children.filter( t => type.includes( t.type ) ) : children
        typeKeysChildren.forEach( e => childIds.push( e.entities ) )
        buildQueryFilter( query, { id: { operation: 'IN', valueList: childIds } } )
        const res = await query.exec();
        return res.map( mapModelToGQL )
      },
      childrenCount: async ( { children = [] }, { type = [] }, info ) => {
        const childIds = []
        const typeKeysChildren = type.length ? children.filter( t => type.includes( t.type ) ) : children
        typeKeysChildren.forEach( e => childIds.push( e.entities ) )
        return childIds.length
      },
      parents: async ( { parents = [] }, { type = [] }, info ) => {
        const query = EntityModel.find()
        const parentIds = []
        const typeKeysParents = type.length ? parents.filter( t => type.includes( t.type ) ) : parents
        typeKeysParents.forEach( e => parentIds.push( e.entities ) )
        buildQueryFilter( query, { id: { operation: 'IN', valueList: parentIds } } )
        const res = await query.exec();
        return res.map( mapModelToGQL )
      },
      parentsCount: async ( { parents = [] }, { type = [] }, info ) => {
        const parentIds = []
        const typeKeysParents = type.length ? parents.filter( t => type.includes( t.type ) ) : parents
        typeKeysParents.forEach( e => parentIds.push( e.entities ) )
        return parentIds.length
      },
      // parents: async ( { parents = {} }, args, info ) => {
      //   const query = EntityModel.find()
      //   const parentIds = Object.keys( parents ).reduce( ( p, c ) => [ ...p, ...parents[ c ] ], [] )
      //   buildQueryFilter( query, { id: { operation: 'IN', valueList: parentIds } } )
      //   const res = await query.exec();
      //   return res.map( mapModelToGQL )
      // },
    }
  },
  read: async ( args, requestedFields ) => {
    const query = EntityModel.find();

    if ( args.by ) {
      buildQueryFilter( query, args.by );
    }
    query.limit( args.limit );

    query.select( requestedFields.join( ' ' ) );
    const res = await query.exec();
    return res.map( mapModelToGQL );
  },
  update: async ( id, data ) => {
    const itemData = mapInputToModel( data )
    const item = await EntityModel.findOneAndUpdate( { "_id": id }, { $set: { ...itemData } } );
    // console.log(item)
    return item.id;
  },
  create: async ( data ) => {
    const session = await EntityModel.startSession()
    session.startTransaction() //TODO: needs replicaSet on DB server
    try {
      const item = await createEntityWithData( { data, session } )
      await session.commitTransaction()
      return item.id;
    } catch ( e ) {
      await session.abortTransaction()
      throw e
    }
  },
  delete: async ( id ) => {
    const item = await EntityModel.deleteOne( { "_id": id } );
    // console.log(item)
    if ( item.deletedCount === 1 )
      return id;
    else
      throw `Nothing deleted with matching id: ${id}`;
  },
}

const mapModelToGQL = ( item ) => {
  // console.log( item.toJSON() )
  const type = {
    id: item.id,
    type: item.get( 'type' ),
    text: item.get( 'text' )?.map( mapLanguageValueDocumentToGQL ),
    children: item.get( 'children' ),
    parents: item.get( 'parents' ),
  }
  return type;
}

const mapInputToModel = ( item ) => {
  // console.log( item )
  // const text = languageValuesToMap( item.text )
  const text = languageValuesToModel( item.text )
  const itemData = {
    type: item.type,
    text,
    // textData: item.text,
    parents: item.parentIDs,
    children: item.childIDs,
    // parents: item.parentIds ? { ...item.parentIds } : {},
    // children: item.childIds ? { ...item.childIds } : {},
  }
  return itemData;
}