package main

import (
	"log"
	"runtime"
	"time"

	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
)

func installMassaNode() {
	os := runtime.GOOS
	arch := runtime.GOARCH

	link, err := node_manager.GetMassaNodeLink(os, arch)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Link: ", link)
	node_manager.DownloadAndUnarchiveNode(link)
	log.Println("Massa Node installed")
}

func main() {
	installMassaNode()
	nodeRunner := node_manager.NodeRunner{}
	err := nodeRunner.StartNode()
	if err != nil {
		log.Fatalln(err)
	}

	for i := 5; i > 0; i-- {
		log.Printf("Shutting down node in %d seconds...", i)
		time.Sleep(1 * time.Second)
	}

	err = nodeRunner.StopNode()
	if err != nil {
		log.Fatalln(err)
	}
}
