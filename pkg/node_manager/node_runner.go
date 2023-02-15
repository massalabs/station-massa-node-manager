package node_manager

import (
	"github.com/sfreiberg/simplessh"
)

func getSSHClient(username string, host string) (*simplessh.Client, error) {
	client, err := simplessh.ConnectWithKeyFile(host, username, SSHKeyFile)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func StartNode(username string, host string) (string, error) {
	client, err := getSSHClient(username, host)
	if err != nil {
		return "", err
	}

	defer client.Close()

	output, err := client.Exec("sudo docker compose up --pull -d --remove-orphans")
	if err != nil {
		return "", err
	}

	return string(output), nil
}

func StopNode(username string, host string) (string, error) {
	client, err := getSSHClient(username, host)
	if err != nil {
		return "", err
	}

	defer client.Close()

	output, err := client.Exec("sudo docker compose stop")
	if err != nil {
		return "", err
	}

	return string(output), nil
}
