package node_manager

import (
	ansibler "github.com/febrianrendak/go-ansible"
)

func InstallMassaNode(username string, host string) (string, error) {
	ansiblePlaybookConnectionOptions := &ansibler.AnsiblePlaybookConnectionOptions{
		Connection: "ssh",
		PrivateKey: SSHKeyFile, // ansible_ssh_private_key_file
		User:       username,   // ansible_user
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
		return "", err
	}

	return "ok", nil
}
