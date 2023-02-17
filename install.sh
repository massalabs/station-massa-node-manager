#!/bin/bash
set -ex

sudo apt install -y ansible
ansible-galaxy collection install community.docker

# Copy static files
rm -rf cmd/node_manager_server/static
mkdir -p cmd/node_manager_server/static
cd front
npm ci
npm run build
cp -r build/* ../cmd/node_manager_server/static
