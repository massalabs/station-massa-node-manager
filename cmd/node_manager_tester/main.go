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
	err := nodeRunner.StartNode(
		node_manager.Node{
			Id:   1,
			Name: "Test",
			Ip:   "localhost",
		},
	)
	if err != nil {
		log.Fatalln(err)
	}

	for i := 10; i > 0; i-- {
		log.Printf("Shutting down node in %d seconds...", i)
		time.Sleep(1 * time.Second)
	}

	err = nodeRunner.StopNode()
	if err != nil {
		log.Fatalln(err)
	}

	nodes, err := node_manager.GetNodes()
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("Nodes: ", nodes)

	node := node_manager.Node{
		Id:   1,
		Name: "Test",
		Ip:   "localhost",
	}
	if err != nil {
		log.Fatalln(err)
	}

	err = node_manager.AddNode(node)
	if err != nil {
		log.Fatalln(err)
	}

	nodes, err = node_manager.GetNodes()
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("AFTER ADD Nodes: ", nodes)
}
