package node_manager

import (
	"errors"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

type NodeRunner struct {
	cmd *exec.Cmd
}

func (runner *NodeRunner) StartNode() error {
	log.Println("Starting node...")

	cwd, _ := os.Getwd()
	nodePath := filepath.Join(cwd, MASSA_NODE_PATH)

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

	println("Node started")
	return nil
}

func (runner *NodeRunner) StopNode() error {
	if runner.cmd != nil {
		log.Println("Stopping node...")
		err := runner.cmd.Process.Kill() // Should be possible to use private `stop_node` RPC call instead
		if err != nil {
			return err
		}
		println("Node stopped")
	} else {
		log.Println("Node not started")
	}
	runner.cmd = nil
	return nil
}
