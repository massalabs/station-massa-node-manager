package node_manager

import "sync"

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
	statusLock.Lock()
	defer statusLock.Unlock()
	node.Status = newState
}

func (node *Node) GetStatus() NodeStatus {
	statusLock.Lock()
	defer statusLock.Unlock()
	return node.Status
}
