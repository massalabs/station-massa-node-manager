package node_manager

import "github.com/massalabs/thyra/pkg/node"

func GetStatus() (*node.State, error) {
	client := node.NewClient("http://localhost:33035")
	status, err := node.Status(client)
	if err != nil {
		return nil, err
	}
	return status, nil
}
