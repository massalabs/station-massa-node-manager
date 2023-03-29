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
	SshPassword       string                `form:"ssh-password"`
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
	SshPassword    string
	Status         NodeStatus
}

func GetSSHKeyPath(nodeId string) string {
	return path.Join(GetSshKeysDir(), nodeId+".priv")
}

func UpdateSshKeyName(oldNodeId string, newNodeId string) error {
	err := os.Rename(GetSSHKeyPath(oldNodeId), GetSSHKeyPath(newNodeId))
	if err != nil {
		return err
	}
	return nil
}

func RemoveSshKeyIfExist(nodeId string) error {
	keyFile := GetSSHKeyPath(nodeId)
	_, err := os.Stat(keyFile)
	if err == nil {
		err = os.Remove(keyFile)
		if err != nil {
			return err
		}
	}
	return nil
}

func (node *Node) GetDockerComposePath() string {
	return path.Join(GetDockerComposeDir(), node.Id+".yml")
}

func (input *InstallNodeInput) CreateNode() Node {
	return Node{Id: input.Id, Username: input.Username, Host: input.Host,
		DiscordId: input.DiscordId, WalletPassword: input.WalletPassword,
		Status: Unknown, SshPassword: input.SshPassword}
}
