package node_manager

import (
	"encoding/base64"
	"os"

	ansibler "github.com/febrianrendak/go-ansible"
)

func Install(input InstallNodeInput) error {
	node := input.createNode()

	err := node.decodeAndWriteKey(input.SSHKeyEncoded)
	if err != nil {
		return err
	}

	err = node.addNode()
	if err != nil {
		return err
	}

	return node.runPlaybook()
}

func createDirIfNotExists(dirname string) error {
	_, err := os.Stat(dirname)
	if os.IsNotExist(err) {
		err = os.Mkdir(dirname, 0755)
		if err != nil {
			return err
		}
	}

	return nil
}

func (node *Node) decodeAndWriteKey(SSHKeyEncoded string) error {
	err := createDirIfNotExists(SSH_PRIVATE_KEY_DIR)
	if err != nil {
		return err
	}

	rawDecodedText, err := base64.StdEncoding.DecodeString(SSHKeyEncoded)
	if err != nil {
		return err
	}

	sshKey := []byte(rawDecodedText)
	return os.WriteFile(node.getSSHKeyPath(), sshKey, 0600)
}

func (node *Node) runPlaybook() error {
	vars := make(map[string]interface{})
	vars["discord_id"] = node.DiscordId
	vars["wallet_password"] = node.WalletPassword

	ansiblePlaybookConnectionOptions := &ansibler.AnsiblePlaybookConnectionOptions{
		Connection: "ssh",
		PrivateKey: node.getSSHKeyPath(), // ansible_ssh_private_key_file
		User:       node.Username,        // ansible_user
	}

	ansiblePlaybookOptions := &ansibler.AnsiblePlaybookOptions{
		ExtraVars: vars,
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
