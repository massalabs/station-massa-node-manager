package node_manager

const CACHE_DIR = ".cache/"
const BIN_DIR = "bin/"

const MASSA_NODE_PATH = BIN_DIR + "massa/massa-node"
const MASSA_NODE_BIN = "massa-node"

const MASSA_VERSION = "TEST.17.2"
const MASSA_BASE_URL = "https://github.com/massalabs/massa/releases/download/" + MASSA_VERSION + "/massa_" + MASSA_VERSION + "_release_"

const NODE_ZIP_MACOS_ADM64_URL = MASSA_BASE_URL + "macos.tar.gz"
const NODE_ZIP_MACOS_ARM64_URL = MASSA_BASE_URL + "macos_aarch64.tar.gz"
const NODE_ZIP_LINUX_ADM64_URL = MASSA_BASE_URL + "linux.tar.gz"
const NODE_ZIP_LINUX_ARM64_URL = MASSA_BASE_URL + "linux_arm64.tar.gz"
const NODE_ZIP_WINDOWS_ADM64_URL = MASSA_BASE_URL + "windows.zip"
