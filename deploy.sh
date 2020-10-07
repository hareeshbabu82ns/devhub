#!/bin/bash
build_docker(){
  echo "building docker image locally"
  docker build -f Dockerfile -t $image_title:$image_version .   
}

deploy_docker(){
  echo "deploying docker image $deploy_location, version $image_version, title $image_title"
  if [ $deploy_location = "local" ]; then
    # docker stop "$image_title"
    echo "stopping and removing container $image_title"
    docker rm "$image_title"  -f
    echo "deploying new container $image_title"
    docker run -p "$port:8000/tcp" -d --name $image_title -e PY_ENV="prod" -e DJANGO_ALLOWED_HOSTS="*" -v '/tmp':'/data' -e SANSKRIT_PARSER_API="$sanskrit_parser_api" $image_title:$image_version
  else
    echo "saving docker image"
    docker save -o "$image_title.tar" $image_title:$image_version
    echo "copying image to remote"
    scp "$image_title.tar" $remote_user@$remote_ip:$remote_tmp
    echo "loading image on remote"
    ssh $remote_user@$remote_ip docker load -i "$remote_tmp/$image_title.tar"
    echo "stopping and removing existing container $image_title"
    ssh $remote_user@$remote_ip docker rm "$image_title" -f
    echo "deploying new container $image_title on remote"
    ssh $remote_user@$remote_ip docker run -d -p "$port:8000/tcp" --name $image_title --net="proxynet" -e AUTH_API="https://auth0.terabits.io" -e SANSKRIT_PARSER_API="$sanskrit_parser_api" -e PY_ENV="prod" -e DJANGO_ALLOWED_HOSTS="*" -e SECRET_KEY=$secret_key -v '/mnt/cache/appdata/devhub':'/data':'rw,slave' $image_title:$image_version
  fi
}

usage(){
  echo "$> deploy.sh [-t <image_title>] -v <image_version> [-l <location>] [-p <port>] [-k <SECRET_KEY>] [-h]"
  echo "ex: $> sh deploy.sh -t devhub -v 1.0 -p 8000"
  echo "ex: $> sh deploy.sh -v 1.2 -p 23842 -l remote -r 192.168.0.2 -k <SECRET_KEY> --sanskrit-parser-api '192.168.0.2:3333/sanskrit_parser/v1'"
}

##### Main

image_title=devhub
image_version=
deploy_location="local"
port=8000
remote_ip=
remote_user="root"
remote_tmp="/mnt/cache/tmp"
secret_key=""
sanskrit_parser_api=""

while [ "$1" != "" ]; do
    case $1 in
        -t | --title )           shift
                                image_title=$1
                                ;;
        -v | --version )        shift
                                image_version="v$1"
                                ;;
        -r | --remote )         shift
                                remote_ip=$1
                                ;;    
        -u | --user )           shift
                                remote_user=$1
                                ;;                                                            
        -k | --secret-key )     shift
                                secret_key=$1
                                ;;                                                            
        --sanskrit-parser-api )     shift
                                sanskrit_parser_api=$1
                                ;;                                                            
        -l | --location )       shift
                                deploy_location=$1
                                ;;         
        -p | --port )           shift
                                port=$1
                                ;;                                                        
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

if [ "$image_version" == "" ]; then
  echo "Image Version (-v) is required"
  usage
  exit 1
fi

if [ $deploy_location != "local" ] && [ "$remote_user" == "" ]; then
  echo "Remote User (-u) is required"
  usage
  exit 1
fi

if [ $deploy_location != "local" ] && [ "$remote_ip" == "" ]; then
  echo "Remote IP (-r) is required"
  usage
  exit 1
fi

if [ $deploy_location != "local" ] && [ "$secret_key" == "" ]; then
  echo "Secret Key (-k) is required"
  usage
  exit 1
fi

if [ $deploy_location != "local" ] && [ "$sanskrit_parser_api" == "" ]; then
  echo "sanskrit_parser_api (--sanskrit-parser-api) is required"
  usage
  exit 1
fi

build_docker

deploy_docker

echo "done"