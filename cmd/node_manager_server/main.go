package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"mime"
	"net"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/node_manager"
	"github.com/massalabs/thyra-node-manager-plugin/pkg/plugin"
	cors "github.com/rs/cors/wrapper/gin"
)

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
		fmt.Println(fmt.Errorf("binding: %w", err))
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	nodeId := c.Query("update")
	if nodeId != "" {
		err := node_manager.RemoveNode(nodeId)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		}
	}

	node := input.CreateNode()

	if err := node_manager.CreateDirIfNotExists(path.Dir(node.GetSSHKeyPath())); err != nil {
		fmt.Println(fmt.Errorf("creating dir: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Creating ssh key dir:" + err.Error()})
		return
	}

	if err := node_manager.CreateDirIfNotExists(path.Dir(node.GetDockerComposePath())); err != nil {
		fmt.Println(fmt.Errorf("creating dir: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Creating docker compose dir:" + err.Error()})
		return
	}

	if err := c.SaveUploadedFile(input.SshKeyFile, node.GetSSHKeyPath()); err != nil {
		fmt.Println(fmt.Errorf("saving file: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": "saving ssh key file:" + err.Error()})
		return
	}

	isDockerComposePresent := input.DockerComposeFile != nil

	if isDockerComposePresent {
		if err := c.SaveUploadedFile(input.DockerComposeFile, node.GetDockerComposePath()); err != nil {
			fmt.Println(fmt.Errorf("saving file: %w", err))
			c.JSON(http.StatusInternalServerError, gin.H{"message": "saving docker compose file:" + err.Error()})
			return
		}
	}

	node.Status = node_manager.Installing
	go node_manager.Install(node, isDockerComposePresent)

	c.JSON(http.StatusCreated, gin.H{"message": "Massa Node installation started"})
}

func startNode(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	output, err := node.StartNode()
	if err != nil {
		fmt.Println(fmt.Errorf("starting node: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Node successfully started", "output": output})
}

func stopNode(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	output, err := node.StopNode()
	if err != nil {
		fmt.Println(fmt.Errorf("stopping node: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Node successfully stopped", "output": output})
}

func getNodeLogs(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.String(http.StatusBadRequest, err.Error())
		return
	}

	output, err := node.GetLogs()
	if err != nil {
		fmt.Println(fmt.Errorf("getting logs: %w", err))
		c.String(http.StatusInternalServerError, err.Error())
		return
	}

	c.String(http.StatusOK, output)
}

func backupWallet(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	filePath, err := node.BackupWallet()
	if err != nil {
		fmt.Println(fmt.Errorf("creating wallet backup: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	fileName := filepath.Base(filePath)
	c.Header("Content-Disposition", "attachment; filename="+fileName)
	contentType := mime.TypeByExtension(filepath.Ext(filePath))
	c.Header("Content-Type", contentType)

	c.File(filePath)
}

func handleManageNodeRequest(c *gin.Context) (*node_manager.Node, error) {
	nodeId := c.Query("id")

	if nodeId == "" {
		return nil, fmt.Errorf("please provide a node id")
	}

	node, err := node_manager.GetNodeById(nodeId)
	if err != nil {
		return nil, err
	}

	if node == nil {
		return nil, fmt.Errorf("node not found")
	}

	return node, nil
}

func getNodes(c *gin.Context) {
	nodes, err := node_manager.GetNodes()
	if err != nil {
		fmt.Println(fmt.Errorf("getting nodes: %w", err))
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, nodes)
}

func getNodeStatus(c *gin.Context) {
	node, err := handleManageNodeRequest(c)
	if err != nil {
		fmt.Println(fmt.Errorf("handling node request: %w", err))
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	status, err := node.UpdateStatus()
	if err != nil {
		fmt.Println(fmt.Errorf("updating status: %w", err))
	}

	wallet_infos, err := node.WalletInfo()
	if err != nil {
		fmt.Println(fmt.Errorf("getting wallet info: %w", err))
	}

	metrics, _ := node.GetSystemMetrics()

	c.JSON(200, gin.H{"status": status, "metrics": metrics, "wallet_infos": wallet_infos})
}

func main() {

	//nolint:gomnd
	if len(os.Args) < 2 {
		panic("this program must be run with correlation id argument!")
	}

	pluginID := os.Args[1]

	standaloneMode := false
	address := ":"

	if len(os.Args) == 3 && os.Args[2] == "--standalone" {
		standaloneMode = true
		address = ":8080"
	}

	router := gin.Default()
	router.Use(cors.Default())
	router.POST("/install", installMassaNode)
	router.POST("/start_node", startNode)
	router.POST("/stop_node", stopNode)
	router.GET("/node_logs", getNodeLogs)
	router.GET("/node_status", getNodeStatus)
	router.GET("/nodes", getNodes)
	router.GET("/backup_wallet", backupWallet)

	embedStatics(router)

	ln, _ := net.Listen("tcp", address)

	log.Println("Listening on " + ln.Addr().String())
	if !standaloneMode {
		err := plugin.Register(pluginID, "Node Manager", "Massalabs", "Install and manage Massa nodes", ln.Addr())
		if err != nil {
			log.Panicln(err)
		}
	}

	err := http.Serve(ln, router)
	if err != nil {
		log.Fatalln(err)
	}
}
