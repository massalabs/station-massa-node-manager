# thyra-node-manager-plugin

## Setup

    go install golang.org/x/tools/cmd/stringer@latest

## Build frontend

    ./build-frontend.sh

## Build backend

    go build -o node_manager ./cmd/node_manager_server/main.go

## Install the plugin

    mkdir -p ~/.config/thyra/my_plugins/node_manager
    mv node_manager ~/.config/thyra/my_plugins/node_manager
