#!/usr/bin/env bash

set -e

VERSION=$(jq -r '.version' package.json)

echo '============== docker restart contianer ==========='
echo '重启container的版本号: ' $VERSION

docker restart frontend.v$VERSION

echo docker container ls -a

echo '============== docker restart successfully =================='