## Devotional Hub
-----
A Hub for Devotional content, with meanings and extra information which is presented in simple ui

### Running

### Authentication
* used [Authelia](https://www.authelia.com/)
  * /api/state - returns 'data.username'
  * /api/user/info - returns 'data.display_name'
* exposing the api under /graphql/me

#### React UI
* as developent server
```sh
$> cd web
$> npm start
```
* serving from Django
```sh
$> cd web
$> npm run build
```
- after build, the index.html will be served as root route on django
#### Django
```sh
$> python manage.py runserver
```
* run scripts `needs django-extensions package` 
```sh
$> python manage.py runscript <script> --script-args <args...>
```

* run Docker local
```sh
$ docker build -f ./Dockerfile.dev -t devhub:latest ./
$ docker run -d \
    -p 8006:8000  --name devhub \
    -e "SECRET_KEY=please_change_me" -e "DEBUG=1" -e "DJANGO_ALLOWED_HOSTS=*" \
    -e "DATA_DIR=/tmp" --env-file .env.dev \
    devhub
```

* initialize the database and migration
```sh
$ docker exec -d devhub python manage.py flush --no-input
$ docker exec -d devhub python manage.py migrate
```

* build production images and spin up
```sh
$ docker build -f ./Dockerfile -t devhub:latest ./
```

* deploying to local docker environment
```sh
# build docker image
$> docker build -f ./Dockerfile -t devhub:latest ./
# to transport image to different environment
$> docker save -o devhub.tar devhub:latest
$> scp devhub.tar user@remote:/mnt/tmp
# in remote server
$> docker load -i devhub.tar

$> mkdir /tmp
$> chown -R <user>:<group> /tmp
$> chmod +777 /tmp

# run image with /data volume mount
$> docker run -d -p '23842:8000/tcp' --name='devhub' \
    -e PY_ENV="prod" -e DJANGO_ALLOWED_HOSTS="*" \
    -e SECRET_KEY="----" \
    --net='proxynet' -v '/tmp':'/data':'rw,slave' \
    devhub
    
# first time only    
$ docker exec -d devhub python manage.py flush --no-input
$ docker exec -d devhub python manage.py migrate
$ docker exec -d devhub python manage.py loaddata init_data
```