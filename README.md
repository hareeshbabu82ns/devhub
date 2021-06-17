## Devotional Hub
-----
A Hub for Devotional content, with meanings and extra information which is presented in simple ui

### Setting for Development
```sh
$> python3 -m venv venv
$> source venv
$> pip install -r requirements.txt
```

### Running

### Authentication

#### React UI
* as developent server
```sh
$> cd web
$> npm start
```
* serving from Flask
```sh
$> cd web
$> npm run build
```
- after build, the index.html will be served as root route on Flask

#### Flask
```sh
$> PYTHONPATH=. python setup.py install
$> python app.py

# run using flask module
$> MONGO_DB_PASSWORD=pwd  \
    MONGO_DB_HOST=192.168.0.10  \
    MONGO_DB_PORT=3333  \
    python -m flask run

# run as gunicorn (in production)    
$> MONGO_DB_PASSWORD=pwd  \
    MONGO_DB_HOST=192.168.0.10  \
    MONGO_DB_PORT=3333  \
    gunicorn --bind 0.0.0.0:5000 wsgi:app
```

* run Docker local
```sh
$ docker build -f ./Dockerfile.dev -t devhub:latest ./
$ docker run -d \
    -p 8006:8000  --name devhub \
    -e "MONGO_DB_HOST=192.168.0.10" -e "MONGO_DB_PORT=3333" -e "MONGO_DB_PASSWORD=test" \
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