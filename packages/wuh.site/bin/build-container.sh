#!/usr/bin/env bash

set -e

echo '============== docker build contianer ==========='
echo '构建container的版本号: ' $1

docker ps -a | grep 'frontend.' | awk '{print $1}' | xargs docker stop
docker ps -a | grep 'frontend.' | awk '{print $1}' | xargs docker rm
docker pull shadowu/wuh.site:latest
docker container run --name frontend.$1 -d -p 3100:3000 --restart=always shadowu/wuh.site:latest

systemctl status docker
systemctl restart nginx

echo '============== docker build successfully =================='