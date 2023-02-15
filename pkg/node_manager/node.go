package node_manager

import (
	"encoding/base64"
	"os"
	"path/filepath"
)

type InstallNodeInput struct {
	Id            string `json:"id" binding:"required"`
	Username      string `json:"username" binding:"required"`
	Host          string `json:"host" binding:"required"`
	SSHKeyEncoded string `json:"sshkey" binding:"required"`
}

type ManageNodeInput struct {
	Id string `json:"id" binding:"required"`
}

type Node struct {
	Id       string
	Username string
	Host     string
}

func (node *Node) getSSHKeyPath() string {
	return filepath.Join(SSH_PRIVATE_KEY_DIR, node.Id) + ".priv"
}

func (node *Node) DecodeKey(SSHKeyEncoded string) error {
	rawDecodedText, err := base64.StdEncoding.DecodeString(SSHKeyEncoded)
	if err != nil {
		return err
	}

	sshKey := []byte(rawDecodedText)
	return os.WriteFile(node.getSSHKeyPath(), sshKey, 0600)
}
