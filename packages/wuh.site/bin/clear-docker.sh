#!/usr/bin/env bash

echo '======== docker container clear============='
docker ps -a | grep 'Exit' | awk '{print $1}' | xargs docker rm
docker images|grep none|awk '{print $3 }'|xargs docker rmi
echo '========== 清理结束 ================'