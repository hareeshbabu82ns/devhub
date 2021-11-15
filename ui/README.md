### Build
$> yarn build
```

### Running Locally
* run TypeScript node
```sh
$> yarn start
```

## Build
### Docker Local
```sh
$> docker build . -t devhubjs
$> docker run -p 4000:4000 --name devhubjs devhubjs
$> docker exec -it devhubjs sh
```