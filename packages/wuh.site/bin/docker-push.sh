#!/usr/bin/env bash

echo '======= docker push pedding ========='

VERSION=$(jq -r '.version' package.json)

echo '当前版本: '$VERSION

git pull origin main -f

docker build  -f Dockerfile -t 'shadowu/wuh.site:latest' -t 'shadowu/wuh.site:'$VERSION .

docker ps -a | grep 'frontend' | awk '{print $1}' | xargs docker stop
docker run --name frontend.$VERSION -it -p 3100:3000 --restart=always shadowu/wuh.site:latest

systemctl restart nginx
systemctl status nginx

docker push 'shadowu/wuh.site:latest'
docker push 'shadowu/wuh.site:'$VERSION

docker history shadowu/wuh.site:latest