* find entities which has parent type GOD Entity 624906a13091955de770988b
```js
{
  "parents": { 
    $elemMatch:{
      "type":"GOD",
      "entities": ObjectId("624906a13091955de770988b")
      }
  }
}
```