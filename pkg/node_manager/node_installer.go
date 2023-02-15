package node_manager

import (
	ansibler "github.com/febrianrendak/go-ansible"
)

func (node *Node) Install() error {
	ansiblePlaybookConnectionOptions := &ansibler.AnsiblePlaybookConnectionOptions{
		Connection: "ssh",
		PrivateKey: node.getSSHKeyPath(), // ansible_ssh_private_key_file
		User:       node.Username,        // ansible_user
	}

	ansiblePlaybookOptions := &ansibler.AnsiblePlaybookOptions{
		Inventory: node.Host + ",",
	}

	playbook := &ansibler.AnsiblePlaybookCmd{
		Playbook:          "./automation/playbook.yml",
		ConnectionOptions: ansiblePlaybookConnectionOptions,
		Options:           ansiblePlaybookOptions,
		ExecPrefix:        "Go-ansible ",
	}

	return playbook.Run()
}
