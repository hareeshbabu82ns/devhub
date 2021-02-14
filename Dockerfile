###########
# BUILDER #
###########

# pull official base image
FROM python:3.8.3-alpine as builder

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
  && apk add postgresql-dev gcc python3-dev musl-dev

COPY . .

# lint
RUN pip install --upgrade pip \
  && pip install flake8 \
  && flake8 --ignore=E501,F401 .

# install dependencies
# COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

###########
# UI BUILDER #
###########

FROM node:14-alpine as ui-builder
WORKDIR /usr/src/app
COPY ./web/package.json /usr/src/app
RUN yarn install
COPY ./web /usr/src/app
RUN yarn build
RUN ls build/

#########
# FINAL #
#########

# pull official base image
FROM python:3.8.3-alpine

# create directory for the app user
# RUN mkdir -p /home/app

# create the app user
RUN addgroup -S app && adduser -S app -G app

# create the appropriate directories
ENV HOME=/home/app
ENV APP_HOME=/home/app/web
ENV APP_WEB_BUILD=/home/app/web/web/build
ENV DATA_DIR=/data

# RUN mkdir $APP_HOME
RUN mkdir $DATA_DIR

WORKDIR $APP_HOME

# install dependencies
RUN apk update && apk add libpq
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# copy entrypoint-prod.sh
COPY ./entrypoint.prod.sh $APP_HOME

# copy project
COPY . $APP_HOME
COPY --from=ui-builder /usr/src/app/build $APP_WEB_BUILD

# RUN ls /web
RUN ls $APP_WEB_BUILD

# copy assets to web static folder
RUN cp $APP_WEB_BUILD/favicon.png $APP_WEB_BUILD/static \
  && cp $APP_WEB_BUILD/sun_128.png $APP_WEB_BUILD/static \
  && cp $APP_WEB_BUILD/sun_512.png $APP_WEB_BUILD/static \
  && cp $APP_WEB_BUILD/manifest.json $APP_WEB_BUILD/static

# chown all the files to the app user
RUN chown -R app:app $APP_HOME \
  && chown -R app:app $DATA_DIR

# change to the app user
USER app

# run entrypoint.prod.sh
ENTRYPOINT ["/home/app/web/entrypoint.prod.sh"]