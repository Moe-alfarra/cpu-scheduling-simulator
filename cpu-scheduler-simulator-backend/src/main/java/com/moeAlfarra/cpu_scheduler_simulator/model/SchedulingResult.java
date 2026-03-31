package com.moeAlfarra.cpu_scheduler_simulator.model;

import java.util.List;

// Scheduling Results
public class SchedulingResult{

    private List<Process> processes;

    private List<ExecutionSegment> ganttChart;

    private int totalWT;
    private int totalTAT;
    private double averageWT;
    private double averageTAT;
    private double cpuUtilization;
    private double throughput;

    public SchedulingResult(List<Process> processes, List<ExecutionSegment> ganttChart,
                            int totalWT, int totalTAT, double averageWT, double averageTAT,
                            double cpuUtilization, double throughput) {
        this.processes = processes;
        this.ganttChart = ganttChart;
        this.totalWT = totalWT;
        this.totalTAT = totalTAT;
        this.averageWT = averageWT;
        this.averageTAT = averageTAT;
        this.cpuUtilization = cpuUtilization;
        this.throughput = throughput;
    }

    public List<Process> getProcesses() {
        return processes;
    }

    public void setProcesses(List<Process> processes) {
        this.processes = processes;
    }

    public List<ExecutionSegment> getGanttChart() {
        return ganttChart;
    }

    public void setGanttChart(List<ExecutionSegment> ganttChart) {
        this.ganttChart = ganttChart;
    }

    public int getTotalWT() {
        return totalWT;
    }

    public void setTotalWT(int totalWT) {
        this.totalWT = totalWT;
    }

    public int getTotalTAT() {
        return totalTAT;
    }

    public void setTotalTAT(int totalTAT) {
        this.totalTAT = totalTAT;
    }

    public double getAverageWT() {
        return averageWT;
    }

    public void setAverageWT(double averageWT) {
        this.averageWT = averageWT;
    }

    public double getAverageTAT() {
        return averageTAT;
    }

    public void setAverageTAT(double averageTAT) {
        this.averageTAT = averageTAT;
    }

    public double getCpuUtilization() {
        return cpuUtilization;
    }

    public void setCpuUtilization(double cpuUtilization) {
        this.cpuUtilization = cpuUtilization;
    }

    public double getThroughput() {
        return throughput;
    }

    public void setThroughput(double throughput) {
        this.throughput = throughput;
    }
}