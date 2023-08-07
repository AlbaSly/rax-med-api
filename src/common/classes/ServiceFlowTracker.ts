export default class ServiceFlowTracker {
    private executedProcesses: Array<string> = []

    setCurrentProccessName(name: string) {
        this.executedProcesses.unshift(name);
    }

    getFirstExecutedProcessName() {
        if (this.executedProcesses.length === 0) return null;

        return this.executedProcesses[this.executedProcesses.length-1];
    }

    getLastExecutedProcessName() {
        if (this.executedProcesses.length === 0) return null;

        return this.executedProcesses[0];
    }

    getAllExecutedProcesses() {
        return this.executedProcesses;
    }
}