#!/bin/bash
set -ex

pushd ../..

# Copy static files
mkdir -p cmd/node_manager_server/static
pushd front
npm ci
npm run build
cp -r build/* ../cmd/node_manager_server/static
popd

popd
