package node_manager

import (
	"fmt"
	"sync"
)

//go:generate stringer -type=NodeStatus
type NodeStatus int

const (
	Unknown NodeStatus = iota
	Up
	Down
	Installing
	Bootstrapping
)

var statusLock sync.Mutex

func (node *Node) SetStatus(newState NodeStatus) {
	node.Status = newState
	err := node.addOrUpdateNode()
	if err != nil {
		fmt.Printf("error while updating status %s", err)
	}
}

func (node *Node) GetStatus() NodeStatus {
	statusLock.Lock()
	defer statusLock.Unlock()
	return node.Status
}
