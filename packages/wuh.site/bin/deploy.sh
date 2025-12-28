#!/usr/bin/env bash
echo "connect remote server successfully"

docker login;

echo '============= [docker image] ============'
docker image ls;
cd /home/next-web-app

echo '============ [docker-compose] ============'
docker-compose pull frontend
docker-compose restart frontend

echo '============ [nginx] ============='
systemctl restart nginx
systemctl status nginx

# # docker-compose build --no-cache && docker-compose restart
# docker-compose stop frontend
# docker-compose rm frontend
# docker-compose up -d --build
# # docker run --name frontend -it -p 3100:3000 --restart=always shadowu/wuh.site:latest

