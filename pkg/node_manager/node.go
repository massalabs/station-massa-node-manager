package node_manager

import (
	"mime/multipart"
	"os"
	"path"
)

type InstallNodeInput struct {
	Id                string                `form:"id" binding:"required"`
	Username          string                `form:"username" binding:"required"`
	Host              string                `form:"host" binding:"required"`
	DiscordId         string                `form:"discord-id"`
	WalletPassword    string                `form:"wallet-password" binding:"required"`
	SshKeyFile        *multipart.FileHeader `form:"file"`
	DockerComposeFile *multipart.FileHeader `form:"docker-compose"`
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
	Status         NodeStatus
}

func (node *Node) GetSSHKeyPath() string {
	return path.Join(GetSshKeysDir(), node.Id+".priv")
}

func UpdateSshKeyName(oldNodeId string, newNodeId string) error {
	err := os.Rename(path.Join(GetSshKeysDir(), oldNodeId+".priv"), path.Join(GetSshKeysDir(), newNodeId+".priv"))
	if err != nil {
		return err
	}
	return nil
}

func (node *Node) GetDockerComposePath() string {
	return path.Join(GetDockerComposeDir(), node.Id+".yml")
}

func (input *InstallNodeInput) CreateNode() Node {
	return Node{Id: input.Id, Username: input.Username, Host: input.Host,
		DiscordId: input.DiscordId, WalletPassword: input.WalletPassword, Status: Unknown}
}
