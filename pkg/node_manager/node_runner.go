package node_manager

import (
	"github.com/sfreiberg/simplessh"
)

func (node *Node) getSSHClient() (*simplessh.Client, error) {
	client, err := simplessh.ConnectWithKeyFile(node.Host, node.Username, node.getSSHKeyPath())
	if err != nil {
		return nil, err
	}

	return client, nil
}

func (node *Node) StartNode() (string, error) {
	client, err := node.getSSHClient()
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

func (node *Node) StopNode() (string, error) {
	client, err := node.getSSHClient()
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
