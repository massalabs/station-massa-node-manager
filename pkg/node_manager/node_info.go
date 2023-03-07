package node_manager

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

type SystemMetrics struct {
	CPU  float64
	RAM  float64
	Disk int
}

type WalletInfo struct {
	Thread            float64
	Candidate_rolls   float64
	Final_rolls       float64
	Active_rolls      float64
	Final_balance     string
	Candidate_balance string
}

func (node *Node) UpdateStatus() (string, error) {
	output, err := node.runCommandSSH("sudo docker exec massa-core massa-cli -j get_status | jq '.version'")
	if err != nil {
		return Down.String(), err
	}

	content := strings.TrimSpace(string(output))

	if strings.HasPrefix(content, "null") {
		node.Status = Bootstrapping
	} else if strings.HasSuffix(content, "not running") || strings.HasSuffix(content, "is restarting, wait until the container is running") {
		node.Status = Down
	} else if strings.HasPrefix(content, "\"TEST") {
		node.Status = Up
	} else {
		node.Status = Unknown
	}

	return node.Status.String(), node.addOrUpdateNode()
}

func (node *Node) WalletInfo() (*WalletInfo, error) {
	output, err := node.runCommandSSH("sudo docker exec massa-core massa-cli -j wallet_info")
	if err != nil {
		return nil, err
	}

	content := strings.TrimSpace(string(output))

	var data map[string]interface{}
	err = json.Unmarshal([]byte(content), &data)
	if err != nil {
		return nil, err
	}

	var wallet_info map[string]interface{}
	for _, infos := range data {
		wallet_info = infos.(map[string]interface{})
		break
	}

	address_info := wallet_info["address_info"].(map[string]interface{})

	return &WalletInfo{address_info["thread"].(float64),
			address_info["candidate_rolls"].(float64),
			address_info["final_rolls"].(float64),
			address_info["final_rolls"].(float64),
			address_info["final_balance"].(string),
			address_info["candidate_balance"].(string)},
		nil
}

func (node *Node) GetSystemMetrics() (*SystemMetrics, error) {
	result, err := node.runCommandSSH("grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'")
	if err != nil {
		return &SystemMetrics{0, 0, 0}, err
	}

	cpu, err := strconv.ParseFloat(strings.TrimSpace((string(result))), 64)
	if err != nil {
		return &SystemMetrics{0, 0, 0}, err
	}

	result, err = node.runCommandSSH("free | awk 'FNR == 2 {print $3/$2 * 100.0}'")
	if err != nil {
		return &SystemMetrics{cpu, 0, 0}, err
	}

	ram, err := strconv.ParseFloat(strings.TrimSpace((string(result))), 64)
	if err != nil {
		return &SystemMetrics{cpu, 0, 0}, err
	}

	result, err = node.runCommandSSH("df --output=pcent / | awk 'NR==2{print substr($1, 1, length($1)-1)}'")
	if err != nil {
		return &SystemMetrics{cpu, ram, 0}, err
	}

	disk, err := strconv.Atoi(strings.TrimSpace(string(result)))
	if err != nil {
		return &SystemMetrics{cpu, ram, 0}, err
	}

	return &SystemMetrics{cpu, ram, disk}, nil
}

func GetNodes() ([]Node, error) {
	filePath := GetNodesListFile()

	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		err := os.WriteFile(filePath, []byte(`[]`), 0644)
		if err != nil {
			log.Fatal(err)
		}
	}

	content, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatal(err)
	}

	var nodes []Node
	err = json.Unmarshal(content, &nodes)
	if err != nil {
		return nil, err
	}

	return nodes, nil
}

func GetNodeById(id string) (*Node, error) {
	nodes, err := GetNodes()
	if err != nil {
		return nil, err
	}

	for i := 0; i < len(nodes); i++ {
		node := nodes[i]
		if node.Id == id {
			return &node, nil
		}
	}

	return nil, nil
}

func (node *Node) addOrUpdateNode() error {
	nodes, err := GetNodes()
	if err != nil {
		return err
	}

	exists := false

	for i, n := range nodes {
		// check if the node already exists
		if n.Id == node.Id {
			// return nil // no nothing
			// or let's update it
			nodes[i] = *node
			exists = true
			break
		}
	}

	if !exists {
		nodes = append(nodes, *node)
	}

	content, err := json.Marshal(nodes)
	if err != nil {
		return err
	}

	return os.WriteFile(GetNodesListFile(), content, 0644)
}

func RemoveNode(nodeId string) error {
	nodes, err := GetNodes()
	if err != nil {
		return err
	}

	exists := false

	for i, n := range nodes {
		// check if the node already exists
		if n.Id == nodeId {
			// delete the node by slicing it out of the slice
			nodes = append(nodes[:i], nodes[i+1:]...)
			exists = true
			break
		}
	}

	if !exists {
		return fmt.Errorf("removing node %s: unable to find %s", nodeId, nodeId)
	}

	content, err := json.Marshal(nodes)
	if err != nil {
		return err
	}

	return os.WriteFile(GetNodesListFile(), content, 0644)
}
