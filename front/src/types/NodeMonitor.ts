export type NodeMonitor = {
    status: "Unknown" | "Up" | "Down" | "Installing" | "Bootstrapping";
    metrics: { CPU: number; RAM: number; Disk: number };
};
