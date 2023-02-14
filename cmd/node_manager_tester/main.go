package main

import (
	ansibler "github.com/febrianrendak/go-ansible"
)

func installMassaNode() {
	ansiblePlaybookConnectionOptions := &ansibler.AnsiblePlaybookConnectionOptions{
		Connection: "ssh",
		PrivateKey: "./automation/ubuntu/idkey", // ansible_ssh_private_key_file
		User:       "massa-ssh",                 // ansible_user
	}

	ansiblePlaybookOptions := &ansibler.AnsiblePlaybookOptions{
		Inventory: "192.168.1.50,",
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

func main() {
	installMassaNode()
}
