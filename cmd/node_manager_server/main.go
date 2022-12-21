package main

import (
	"flag"
	"log"
	"os"
	"runtime"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
)

var nodeRunner = node_manager.NodeRunner{}

func installMassaNode(c *gin.Context) {
	os := runtime.GOOS
	arch := runtime.GOARCH

	link, err := node_manager.GetMassaNodeLink(os, arch)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	log.Println("Link: ", link)
	node_manager.DownloadAndUnarchiveNode(link)
	log.Println("Massa Node installed")
	c.JSON(200, gin.H{"message": "Massa Node installed"})
}

func startNode(c *gin.Context) {
	err := nodeRunner.StartNode()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Node successfully started"})
}

func stopNode(c *gin.Context) {
	err := nodeRunner.StopNode()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Node successfully stopped"})
}

func getNodeStatus(c *gin.Context) {
	status, err := node_manager.GetStatus()
	// TODO: Improve error handling.
	// The node might be started but stuck in bootstraping.
	// In this case, the node is not ready to receive requests and the error should be handled differently.
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, status)
}

func main() {
	port := flag.Int("port", 8080, "set listening port")
	defaultPath, _ := os.Getwd()
	path := flag.String("path", defaultPath, "set plugin path")
	flag.Parse()

	node_manager.WorkingDir = *path
	nodeRunner := node_manager.NodeRunner{}

	router := gin.Default()
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", stopNode)
	router.GET("/node_status", getNodeStatus)

	err := router.Run("127.0.0.1:" + strconv.Itoa(*port))
	if err != nil {
		log.Fatalln(err)
	}

	err = nodeRunner.StopNode()
	if err != nil {
		log.Fatalln(err)
	}
}
