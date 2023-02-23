#!/bin/bash
set -ex

# Copy static files
rm -rf cmd/node_manager_server/static
mkdir -p cmd/node_manager_server/static
cd front
npm ci
npm run build
cp -r build/* ../cmd/node_manager_server/static
