## Devotional Hub
-----
A Hub for Devotional content, with meanings and extra information which is presented in simple ui

### Running
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
    --env-file .env.dev \
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