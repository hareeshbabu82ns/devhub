# Database Usage Scenarios
## Queries
* all Gods or all Authurs
  * select all **entities** by **type** = **type**
  * index on _entities -> type_
* all Entities of God or Authurs
  * select all **entities** by **relatedParents.id** = **_id**
  * index on _entities -> relatedParents -> id_
* all Child Entity Types available for an Entity
  * select all **entities** by **relatedChildsByType.entities[]** is not empty
* all Child Entities available for an Entity
  * select all **entities** by **parent** = **_id**

## Read Write Frequencies
* **entities**
  * low in writes
  * high in reads