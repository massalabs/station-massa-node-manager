package node_manager

import (
	"path/filepath"
)

type InstallNodeInput struct {
	Id             string `json:"id" binding:"required"`
	Username       string `json:"username" binding:"required"`
	Host           string `json:"host" binding:"required"`
	SSHKeyEncoded  string `json:"sshkey" binding:"required"`
	DiscordId      string `json:"discord-id"`
	WalletPassword string `json:"wallet-password" binding:"required"`
}

type ManageNodeInput struct {
	Id string `json:"id" binding:"required"`
}

type Node struct {
	Id             string
	Username       string
	Host           string
	DiscordId      string
	WalletPassword string
}

func (node *Node) getSSHKeyPath() string {
	return filepath.Join(SSH_PRIVATE_KEY_DIR, node.Id) + ".priv"
}

func (input *InstallNodeInput) createNode() Node {
	return Node{Id: input.Id, Username: input.Username, Host: input.Host,
		DiscordId: input.DiscordId, WalletPassword: input.WalletPassword}
}
