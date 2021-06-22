### Generate Type Script Types from Graphql Schema
```sh
$> yarn gql-gen
```

### Running Locally
* run TypeScript node
```sh
$> yarn serve
```

## Build
### Docker Local
```sh
$> docker build . -t devhubjs
$> docker run -p 4000:4000 --name devhubjs devhubjs
$> docker exec -it devhubjs sh
```