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