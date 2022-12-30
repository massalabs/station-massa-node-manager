package node_manager

type Node struct {
	Id   int    `json:"id"`
	Name string `json:"nodeName"`
	Ip   string `json:"ip"`
}
