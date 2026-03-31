package com.moeAlfarra.cpu_scheduler_simulator.model;

// Gantt Diagram Segments
public class ExecutionSegment {

    private int pid;

    private int startTime;

    private int endTime;

    public ExecutionSegment(int pid, int startTime, int endTime) {
        this.pid = pid;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public int getPid() {
        return pid;
    }

    public void setPid(int pid) {
        this.pid = pid;
    }

    public int getStartTime() {
        return startTime;
    }

    public void setStartTime(int startTime) {
        this.startTime = startTime;
    }

    public int getEndTime() {
        return endTime;
    }

    public void setEndTime(int endTime) {
        this.endTime = endTime;
    }
}
