# thyra-node-manager-plugin

## Development guide

### Setup

Install this package used to generate golang code to handle enums:

    go install golang.org/x/tools/cmd/stringer@latest

### Build frontend

    ./build-frontend.sh

### Generate code

    go generate ./...

### Build backend API

    go build -o node_manager ./cmd/node_manager_server/main.go

### Run plugin in standalone mode

Start the backend API:

    go run cmd/node_manager_server/main.go 1 --standalone

Access to the plugin: <http://localhost:8080>.

Start the frontend development server:

    cd front
    npm run start

### Install the plugin

You can also do integration test by installing manually the plugin:

    mkdir -p ~/.config/thyra/my_plugins/node_manager
    mv node_manager ~/.config/thyra/my_plugins/node_manager

Then you can run Thyra and navigate into the plugin.

## Get your Discord token

<https://www.androidauthority.com/get-discord-token-3149920>
