#!/bin/bash

git push

echo "wait for container to build"
sleep 90

ssh triton "pushd /opt/containers/nospeak &&
           docker compose down &&
           docker compose pull &&
           docker compose up -d &&
           popd"
