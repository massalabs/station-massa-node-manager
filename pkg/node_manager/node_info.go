package node_manager

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path"
	"strconv"
	"strings"
)

type SystemMetrics struct {
	CPU  float64
	RAM  float64
	Disk int
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

	err = node.addOrUpdateNode()
	if err != nil {
		fmt.Println(err.Error())
	}

	return node.Status.String(), err
}

func (node *Node) GetSystemMetrics() (*SystemMetrics, error) {
	result, err := node.runCommandSSH("grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}'")
	if err != nil {
		return nil, err
	}

	cpu, err := strconv.ParseFloat(strings.TrimSpace((string(result))), 64)
	if err != nil {
		return nil, err
	}

	result, err = node.runCommandSSH("free | awk 'FNR == 2 {print $3/$2 * 100.0}'")
	if err != nil {
		return nil, err
	}

	ram, err := strconv.ParseFloat(strings.TrimSpace((string(result))), 64)
	if err != nil {
		return nil, err
	}

	result, err = node.runCommandSSH("df | awk 'FNR == 2 {print $5}' | cut -c 1-2")
	if err != nil {
		return nil, err
	}

	disk, err := strconv.Atoi(strings.TrimSpace(string(result)))
	if err != nil {
		return nil, err
	}

	return &SystemMetrics{cpu, ram, disk}, nil
}

func getNodesFilePath() string {
	return path.Join(WORKING_DIR, NODES_FILENAME)
}

func GetNodes() ([]Node, error) {
	filePath := getNodesFilePath()

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

	for i := 0; i < len(nodes); i++ {
		// check if the node already exists
		if nodes[i].Id == node.Id {
			// return nil // no nothing
			// or let's update it
			nodes[i] = *node
			exists = true
		}
	}

	if !exists {
		nodes = append(nodes, *node)
	}

	filePath := getNodesFilePath()
	content, err := json.Marshal(nodes)
	if err != nil {
		return err
	}

	return os.WriteFile(filePath, content, 0644)
}
