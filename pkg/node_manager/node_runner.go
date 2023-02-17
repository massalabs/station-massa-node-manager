package node_manager

import (
	"github.com/sfreiberg/simplessh"
)

func (node *Node) getSSHClient() (*simplessh.Client, error) {

	client, err := simplessh.ConnectWithKeyFile(node.Host, node.Username, node.GetSSHKeyPath())
	if err != nil {
		return nil, err
	}

	return client, nil
}

func (node *Node) StartNode() (string, error) {
	output, err := node.runCommandSSH("sudo docker compose up --pull -d --remove-orphans")
	if err != nil {
		return "", err
	}

	return string(output), nil
}

func (node *Node) StopNode() (string, error) {
	output, err := node.runCommandSSH("sudo docker compose stop")
	if err != nil {
		return "", err
	}

	return string(output), nil
}

func (node *Node) GetLogs() (string, error) {
	output, err := node.runCommandSSH("sudo docker compose logs -n 100")

	if err != nil {
		return "", err
	}

	return string(output), nil
}

func (node *Node) runCommandSSH(command string) ([]byte, error) {
	client, err := node.getSSHClient()
	if err != nil {
		return []byte{}, err
	}

	defer client.Close()

	return client.Exec(command)
}

func (node *Node) uploadFileSSH(local string, remote string) error {
	client, err := node.getSSHClient()
	if err != nil {
		return err
	}

	defer client.Close()

	return client.Upload(local, remote)
}
