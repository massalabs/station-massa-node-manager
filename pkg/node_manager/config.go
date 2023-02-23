package node_manager

import (
	"os"
	"path"
	"path/filepath"
	"strings"
)

func GetWorkDir() string {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}

	dir := filepath.Dir(ex)

	// Helpful when developing:
	// when running `go run`, the executable is in a temporary directory.
	if strings.Contains(dir, "go-build") {
		return "."
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
