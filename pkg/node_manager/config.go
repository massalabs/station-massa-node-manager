package node_manager

import (
	"os"
	"path"
	"path/filepath"
)

func GetWorkDir() string {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	return filepath.Dir(ex)
}

const NODES_FILENAME = "nodes.json"

func GetNodesListFile() string {
	return path.Join(GetWorkDir(), NODES_FILENAME)
}

const SSH_PRIVATE_KEY_DIR = "ssh-private-keys"

func GetSshKeysDir() string {
	return path.Join(GetWorkDir(), SSH_PRIVATE_KEY_DIR)
}

const DOCKER_COMPOSE_DIR = "docker-compose"

func GetDockerComposeDir() string {
	return path.Join(GetWorkDir(), DOCKER_COMPOSE_DIR)
}
