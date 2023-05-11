### Types
```graphql
query getTypes{
  entityTypes{
    id
    name
    code
    description
  }
}
mutation createType{
  slokam:createEntityType(withData:{name:"Slokam",code:SLOKAM})
  stotram:createEntityType(withData:{name:"Stothram",code:STHOTRAM})
}
```
### Languages
```graphql
query getLanguages{
  languages{
    id
    iso
    name
    description
  }
}
mutation createLanguage{
  createLanguage(withData:{iso:"SAN",name:"Samskrutham"})
}
```
### Entities
```graphql
query getEntities {
  entities {
    id
    text
    type
    childrenCount
    children(type:SLOKAM) {
      id
      type
      text
    }
    parentsCount
    parents{
      id
      type
      text
    }
  }
}
mutation createEntityWithParent {
  createEntity(
    withData: {
      type: STHOTRAM
      text: [{ language: "SAN", value: "guru paduka" }]
      parents: [
        { type: GOD, text: [{ language: "SAN", value: "Dakshina murthi" }] }
      ]
      children: [
        { type: SLOKAM, text: [{ language: "SAN", value: "slokam 1" }] }
        { type: SLOKAM, text: [{ language: "SAN", value: "slokam 2" }] }
      ]
    }
  )
}
mutation createEntityGod {
  createEntity(
    withData: {
      type: GOD
      text: [{ language: "SAN", value: "god 1" }]
      children: [
        { type: STHOTRAM, text: [{ language: "SAN", value: "Stotram 1" }] }
      ]
    }
  )
}
mutation createEntitySthotram {
  createEntity(
    withData: {
      type: STHOTRAM
      text: [{ language: "SAN", value: "sthotram text" }]
    }
  )
}
mutation createEntitySlokam {
  createEntity(
    withData: {
      type: SLOKAM
      text: [{ language: "SAN", value: "slokam 1 text" }]
      parentIDs: [
        { type: STHOTRAM, entities: ["62486b6be616ca935ff93924"] }
        { type: GOD, entities: ["624887b7f41c8c0b751f623d"] }
      ]
    }
  )
}
```