package node_manager

import (
	"mime/multipart"
	"path"
)

type InstallNodeInput struct {
	Id                string                `form:"id" binding:"required"`
	Username          string                `form:"username" binding:"required"`
	Host              string                `form:"host" binding:"required"`
	DiscordId         string                `form:"discord-id"`
	WalletPassword    string                `form:"wallet-password" binding:"required"`
	SshKeyFile        *multipart.FileHeader `form:"file" binding:"required"`
	DockerComposeFile *multipart.FileHeader `form:"docker-compose"`
}

//go:generate stringer -type=NodeStatus
type NodeStatus int

const (
	Unknown NodeStatus = iota
	Up
	Down
	Installing
	Bootstrapping
)

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
	return path.Join(SSH_PRIVATE_KEY_DIR, node.Id+".priv")
}

func (node *Node) GetDockerComposePath() string {
	return path.Join(DOCKER_COMPOSE_DIR, node.Id+".yml")
}

func (input *InstallNodeInput) CreateNode() Node {
	return Node{Id: input.Id, Username: input.Username, Host: input.Host,
		DiscordId: input.DiscordId, WalletPassword: input.WalletPassword, Status: Unknown}
}
