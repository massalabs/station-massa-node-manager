package node_manager

import (
	"context"
	"errors"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/massalabs/thyra/pkg/node"
)

type NodeState string

const (
	RUNNING      NodeState = "RUNNING"
	BOOTSTRAPING NodeState = "BOOTSTRAPING"
	STOPPED      NodeState = "STOPPED"
)

type NodeRunner struct {
	node *Node
	cmd  *exec.Cmd
}

func (runner *NodeRunner) GetNodeState() NodeState {
	if runner.cmd == nil {
		return STOPPED
	}

	if runner.cmd.ProcessState != nil && runner.cmd.ProcessState.Exited() {
		return STOPPED
	}

	client := node.NewClient("http://" + runner.node.Ip + ":33035")
	_, err := node.Status(client)
	if err != nil {
		if strings.HasPrefix(err.Error(), "calling get_status") {
			return BOOTSTRAPING
		}
		return STOPPED
	}
	return RUNNING
}

func (runner *NodeRunner) StartNode(node Node) error {
	if runner.cmd != nil {
		return errors.New("Node already started")
	}
	log.Println("Starting node...")

	nodePath := getMassaNodePath()

	nodeBinName := MASSA_NODE_BIN
	if runtime.GOOS == "windows" {
		nodeBinName += ".exe"
	}

	if _, err := os.Stat(filepath.Join(nodePath, nodeBinName)); err != nil {
		return errors.New("Node binary not found: " + err.Error())
	}

	password := "123456"

	runner.cmd = exec.Command(filepath.Join(nodePath, nodeBinName), "-p", password)
	runner.cmd.Dir = nodePath
	runner.cmd.Stdout = os.Stdout
	runner.cmd.Stderr = os.Stderr

	go func() {
		err := runner.cmd.Run()
		if err != nil {
			log.Println("Node error: ", err)
		}
	}()

	runner.node = &node
	println("Node started")
	return nil
}

func (runner *NodeRunner) StopNode() error {
	if runner.cmd != nil {
		log.Println("Stopping node...")
		client := node.NewClient("http://" + runner.node.Ip + ":33034")
		_, err := client.RPCClient.Call(
			context.Background(),
			"stop_node",
		)
		if err != nil {
			err := runner.cmd.Process.Kill()
			if err != nil { // This if might be useless
				return err
			}
		}
		log.Println("Node stopped")
	} else {
		log.Println("Node not stopped")
	}
	runner.cmd = nil
	return nil
}
