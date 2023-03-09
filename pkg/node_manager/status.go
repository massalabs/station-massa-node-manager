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

func setStatus(node Node, newState NodeStatus) {
	statusLock.Lock()
	defer statusLock.Unlock()
	node.Status = newState
}

func getStatus(node Node) NodeStatus {
	statusLock.Lock()
	defer statusLock.Unlock()
	return node.Status
}
