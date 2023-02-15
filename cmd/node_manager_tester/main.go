package main

import (
	"fmt"
	"time"

	ansibler "github.com/febrianrendak/go-ansible"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
	"github.com/sfreiberg/simplessh"
)

const host = "192.168.1.50"
const username = "massa-ssh"

func installMassaNode() {
	ansiblePlaybookConnectionOptions := &ansibler.AnsiblePlaybookConnectionOptions{
		Connection: "ssh",
		PrivateKey: node_manager.SSHKeyFile, // ansible_ssh_private_key_file
		User:       username,                // ansible_user
	}

	ansiblePlaybookOptions := &ansibler.AnsiblePlaybookOptions{
		Inventory: host + ",",
	}

	playbook := &ansibler.AnsiblePlaybookCmd{
		Playbook:          "./automation/playbook.yml",
		ConnectionOptions: ansiblePlaybookConnectionOptions,
		Options:           ansiblePlaybookOptions,
		ExecPrefix:        "Go-ansible ",
	}

	err := playbook.Run()
	if err != nil {
		panic(err)
	}
}

func getSSHClient() *simplessh.Client {
	client, err := simplessh.ConnectWithKeyFile(host, username, node_manager.SSHKeyFile)
	if err != nil {
		panic(err)
	}

	return client
}

func startNode() {
	client := getSSHClient()
	defer client.Close()

	output, err := client.Exec("sudo docker compose up --pull -d --remove-orphans")
	if err != nil {
		panic(err)
	}

	fmt.Printf("docker-compose up: %s\n", output)
}

func stopNode() {
	client := getSSHClient()
	defer client.Close()

	output, err := client.Exec("sudo docker compose stop")
	if err != nil {
		panic(err)
	}

	fmt.Printf("docker-compose stop: %s\n", output)
}

func getLogs() {
	client := getSSHClient()
	defer client.Close()

	output, err := client.Exec("sudo docker compose logs")
	if err != nil {
		panic(err)
	}

	fmt.Printf("docker-compose logs: %s\n", output)
}

func main() {
	installMassaNode()
	startNode()
	getLogs()
	time.Sleep(5 * time.Second)
	getLogs()
	time.Sleep(5 * time.Second)
	stopNode()
}
