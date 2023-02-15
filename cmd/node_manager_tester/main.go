package main

import (
	"fmt"
	"time"

	ansibler "github.com/febrianrendak/go-ansible"
	"github.com/sfreiberg/simplessh"
)

const host = "192.168.1.50"
const keyFile = "./automation/ubuntu/idkey"
const username = "massa-ssh"

func installMassaNode() {
	ansiblePlaybookConnectionOptions := &ansibler.AnsiblePlaybookConnectionOptions{
		Connection: "ssh",
		PrivateKey: keyFile,  // ansible_ssh_private_key_file
		User:       username, // ansible_user
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
	client, err := simplessh.ConnectWithKeyFile(host, username, keyFile)
	if err != nil {
		panic(err)
	}

	return client
}

func startNode() {
	client := getSSHClient()
	defer client.Close()

	output, err := client.Exec("sudo docker compose up -d")
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

func main() {
	installMassaNode()
	startNode()
	time.Sleep(5 * time.Second)
	stopNode()
}
