package main

import (
	"embed"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"path"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/plugin"
	cors "github.com/rs/cors/wrapper/gin"
)

//go:generate ./install.sh

//go:embed static/*
var staticFiles embed.FS

type embedFileSystem struct {
	http.FileSystem
}

func (e embedFileSystem) Exists(prefix string, path string) bool {
	_, err := e.Open(path)
	return err == nil
}

func EmbedFolder(fsEmbed embed.FS, targetPath string) static.ServeFileSystem {
	fsys, err := fs.Sub(fsEmbed, targetPath)
	if err != nil {
		log.Panicln(err)
	}
	return embedFileSystem{
		FileSystem: http.FS(fsys),
	}
}

func embedStatics(router *gin.Engine) {
	router.Use(static.Serve("/", EmbedFolder(staticFiles, "static")))
}

func installMassaNode(c *gin.Context) {

	var input node_manager.InstallNodeInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"ShouldBindJSON error": err.Error()})
		return
	}

	node := input.CreateNode()

	if err := node_manager.CreateDirIfNotExists(path.Dir(node.GetSSHKeyPath())); err != nil {
		c.String(http.StatusInternalServerError, "Creating ssh key dir:"+err.Error())
		return
	}

	if err := c.SaveUploadedFile(input.SshKeyFile, node.GetSSHKeyPath()); err != nil {
		c.String(http.StatusInternalServerError, "saving ssh key file:"+err.Error())
		return
	}

	err := node_manager.Install(node)
	if err != nil {
		c.String(http.StatusInternalServerError, "installing node:"+err.Error())
		return
	}

	c.JSON(200, gin.H{"message": "Massa Node installed"})
}

func startNode(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		return
	}

	output, err := node.StartNode()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Node successfully started", "output": output})
}

func stopNode(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		return
	}

	output, err := node.StopNode()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "Node successfully stopped", "output": output})
}

func getNodeLogs(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		return
	}
	output, err := node.GetLogs()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "got logs", "logs": output})
}

func handleManageNodeRequest(c *gin.Context) (*node_manager.Node, error) {
	var input node_manager.ManageNodeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return nil, err
	}

	node, err := node_manager.GetNodeById(input.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": err})
	}

	return node, nil
}

func getNodes(c *gin.Context) {
	nodes, err := node_manager.GetNodes()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, nodes)
}

func getNodeStatus(c *gin.Context) {
	var input node_manager.ManageNodeInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	node, err := node_manager.GetNodeById(input.Id)
	if err != nil {
		c.JSON(500, gin.H{"error": err})
	}

	status, err := node.GetStatus()
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, gin.H{"status": status})
}

func main() {

	//nolint:gomnd
	if len(os.Args) < 2 {
		panic("this program must be run with correlation id argument!")
	}

	pluginID := os.Args[1]

	standaloneMode := false

	if len(os.Args) == 3 && os.Args[2] == "--standalone" {
		standaloneMode = true
	}

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", stopNode)
	router.GET("/node_logs", getNodeLogs)
	router.GET("/node_status", getNodeStatus)
	router.GET("/nodes", getNodes)

	embedStatics(router)

	ln, _ := net.Listen("tcp", ":")

	log.Println("Listening on " + ln.Addr().String())
	if !standaloneMode {
		err := plugin.Register(pluginID, "Node Manager", "Massalabs", "Install and manege Massa nodes", ln.Addr())
		if err != nil {
			log.Panicln(err)
		}
	}

	err := http.Serve(ln, router)
	if err != nil {
		log.Fatalln(err)
	}
}
