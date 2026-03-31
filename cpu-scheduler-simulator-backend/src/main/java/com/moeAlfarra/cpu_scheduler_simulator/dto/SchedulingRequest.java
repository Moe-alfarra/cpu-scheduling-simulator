package com.moeAlfarra.cpu_scheduler_simulator.dto;
import com.moeAlfarra.cpu_scheduler_simulator.model.Process;
import java.util.List;

// Request Structure
public class SchedulingRequest {
    private String algorithm;
    private Integer quantum;
    private List<Process> processes;

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public Integer getQuantum() {
        return quantum;
    }

    public void setQuantum(Integer quantum) {
        this.quantum = quantum;
    }

    public List<Process> getProcesses() {
        return processes;
    }

    public void setProcesses(List<Process> processes) {
        this.processes = processes;
    }
}