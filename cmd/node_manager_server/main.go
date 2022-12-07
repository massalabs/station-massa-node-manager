package main

import (
	"log"
	"runtime"

	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
)

var nodeRunner = node_manager.NodeRunner{}

func installMassaNode(c *gin.Context) {
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

func startNode(c *gin.Context) {
	err := nodeRunner.StartNode()
	if err != nil {
		log.Fatalln(err)
	}
}

func StopNode(c *gin.Context) {
	err := nodeRunner.StopNode()
	if err != nil {
		log.Fatalln(err)
	}
}

func main() {
	nodeRunner := node_manager.NodeRunner{}

	router := gin.Default()
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", StopNode)

	router.Run("127.0.0.1:8080")

	err := nodeRunner.StopNode()
	if err != nil {
		log.Fatalln(err)
	}
}
