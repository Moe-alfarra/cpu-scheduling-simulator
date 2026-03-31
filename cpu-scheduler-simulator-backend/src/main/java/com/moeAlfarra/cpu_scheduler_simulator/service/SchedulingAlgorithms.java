package com.moeAlfarra.cpu_scheduler_simulator.service;

import com.moeAlfarra.cpu_scheduler_simulator.model.ExecutionSegment;
import com.moeAlfarra.cpu_scheduler_simulator.model.SchedulingResult;
import com.moeAlfarra.cpu_scheduler_simulator.model.Process;

import java.util.*;

// Scheduling Algorithms
public class SchedulingAlgorithms {

    // FCFS
    public static SchedulingResult fcfs(List<Process> processes) {
        resetProcesses(processes);
        // ALGORITHM
        int currentTime = 0;
        List<ExecutionSegment> ganttChart = new ArrayList<>(); // Gantt Chart

        processes.sort(Comparator.comparingInt(Process::getArrivalTime)
                .thenComparingInt(Process::getPid)); // Sort Processes

        for (Process p : processes) {
            if (currentTime < p.getArrivalTime()) {
                ganttChart.add(new ExecutionSegment(0, currentTime, p.getArrivalTime()));
                currentTime = p.getArrivalTime();
            }

            int startTime = currentTime;
            currentTime += p.getBurstTime();
            int endTime = currentTime;

            ganttChart.add(new ExecutionSegment(p.getPid(), startTime, endTime));

            p.setCompletionTime(endTime);
            p.setTurnAroundTime(p.getCompletionTime() - p.getArrivalTime());
            p.setWaitTime(p.getTurnAroundTime() - p.getBurstTime());
            p.setCompleted(true);
        }
        // RESULT
        return buildResult(processes, ganttChart, currentTime);

    }

    // SJF
    public static SchedulingResult sjf(List<Process> processes) {
        resetProcesses(processes);
        List<ExecutionSegment> ganttChart = new ArrayList<>();

        // ALGORITHM
        processes.sort(Comparator.comparingInt(Process::getArrivalTime)
                .thenComparingInt(Process::getPid));

        PriorityQueue<Process> readyQueue = new PriorityQueue<>(
                Comparator.comparingInt(Process::getBurstTime).thenComparingInt(Process::getArrivalTime)
                        .thenComparingInt(Process::getPid));

        int currentTime = 0;
        int index = 0;
        int completed = 0;
        int n = processes.size();

        while (completed < n) {
            while (index < n && processes.get(index).getArrivalTime() <= currentTime) {
                readyQueue.add(processes.get(index));
                index++;
            }

            if (readyQueue.isEmpty()) {
                if (index < n) {
                    ganttChart.add(new ExecutionSegment(0, currentTime, processes.get(index).getArrivalTime()));
                    currentTime = processes.get(index).getArrivalTime();
                }
                continue;
            }

            Process current = readyQueue.poll();

            int startTime = currentTime;
            currentTime += current.getBurstTime();
            int endTime = currentTime;

            ganttChart.add(new ExecutionSegment(current.getPid(), startTime, endTime));

            current.setCompletionTime(endTime);
            current.setTurnAroundTime(current.getCompletionTime() - current.getArrivalTime());
            current.setWaitTime(current.getTurnAroundTime() - current.getBurstTime());
            current.setCompleted(true);

            completed++;
        }
        //RESULT
        return buildResult(processes, ganttChart, currentTime);
    }

    // SRTF
    public static SchedulingResult srtf(List<Process> processes) {
        resetProcesses(processes);
        int currentTime = 0;
        int completed = 0;
        int n = processes.size();

        List<ExecutionSegment> ganttChart = new ArrayList<>();

        while (completed < n) {
            Process shortest = null;

            for (Process p : processes) {
                if (!p.isCompleted() && p.getArrivalTime() <= currentTime) {
                    if (shortest == null
                            || p.getRemainingTime() < shortest.getRemainingTime()
                            || (p.getRemainingTime() == shortest.getRemainingTime()
                            && p.getArrivalTime() < shortest.getArrivalTime())
                            || (p.getRemainingTime() == shortest.getRemainingTime()
                            && p.getArrivalTime() == shortest.getArrivalTime()
                            && p.getPid() < shortest.getPid())) {
                        shortest = p;
                    }
                }
            }

            // No process available -> jump directly to next arrival
            if (shortest == null) {
                int nextArrival = Integer.MAX_VALUE;

                for (Process p : processes) {
                    if (!p.isCompleted() && p.getArrivalTime() > currentTime) {
                        nextArrival = Math.min(nextArrival, p.getArrivalTime());
                    }
                }

                if (nextArrival != Integer.MAX_VALUE) {
                    addOrExtendSegment(ganttChart, 0, currentTime, nextArrival);
                    currentTime = nextArrival;
                }
                continue;
            }

            // Execute for 1 time unit (preemptive)
            addOrExtendSegment(ganttChart, shortest.getPid(), currentTime, currentTime + 1);

            shortest.setRemainingTime(shortest.getRemainingTime() - 1);
            currentTime++;

            if (shortest.getRemainingTime() == 0) {
                shortest.setCompletionTime(currentTime);
                shortest.setTurnAroundTime(shortest.getCompletionTime() - shortest.getArrivalTime());
                shortest.setWaitTime(shortest.getTurnAroundTime() - shortest.getBurstTime());
                shortest.setCompleted(true);
                completed++;
            }
        }
        // RESULT
        return buildResult(processes, ganttChart, currentTime);
    }
    // Round-Robin
    public static SchedulingResult roundRobin(List<Process> processes, int quantum) {
        resetProcesses(processes);
        processes.sort(Comparator.comparingInt(Process::getArrivalTime)
                .thenComparingInt(Process::getPid));

        List<ExecutionSegment> ganttChart = new ArrayList<>();
        Queue<Process> readyQueue = new LinkedList<>();

        int currentTime = 0;
        int completed = 0;
        int n = processes.size();
        int index = 0;

        if (n == 0) {
            return new SchedulingResult(processes, ganttChart, 0, 0, 0, 0, 0, 0);
        }

        while (completed < n) {
            // Add all arrived processes
            while (index < n && processes.get(index).getArrivalTime() <= currentTime) {
                readyQueue.add(processes.get(index));
                index++;
            }

            // If queue empty, CPU is idle until next arrival
            if (readyQueue.isEmpty()) {
                if (index < n) {
                    int nextArrival = processes.get(index).getArrivalTime();
                    addOrExtendSegment(ganttChart, 0, currentTime, nextArrival);
                    currentTime = nextArrival;
                    continue;
                }
            }

            Process current = readyQueue.poll();

            int startTime = currentTime;
            int runTime = Math.min(quantum, current.getRemainingTime());

            current.setRemainingTime(current.getRemainingTime() - runTime);
            currentTime += runTime;

            addOrExtendSegment(ganttChart, current.getPid(), startTime, currentTime);

            // Add any new arrivals that came during execution
            while (index < n && processes.get(index).getArrivalTime() <= currentTime) {
                readyQueue.add(processes.get(index));
                index++;
            }

            if (current.getRemainingTime() > 0) {
                readyQueue.add(current);
            } else {
                current.setCompletionTime(currentTime);
                current.setTurnAroundTime(current.getCompletionTime() - current.getArrivalTime());
                current.setWaitTime(current.getTurnAroundTime() - current.getBurstTime());
                current.setCompleted(true);
                completed++;
            }
        }
        // RESULT
        return buildResult(processes, ganttChart, currentTime);
    }


    // HELPER METHOD TO COPY PROCESSES FOR NEW REQUEST
    public static List<Process> copyProcesses(List<Process> processes) {
        List<Process> copy = new ArrayList<>();
        for (Process p : processes) {
            copy.add(new Process(p));
        }
        return copy;
    }

    // HELPER METHOD TO RESET PROCESSES
    public static void resetProcesses(List<Process> processes) {
        for (Process p : processes) {
            p.setRemainingTime(p.getBurstTime());
            p.setCompletionTime(0);
            p.setTurnAroundTime(0);
            p.setWaitTime(0);
            p.setCompleted(false);
        }
    }

    // HELPER METHOD FOR SRTF GANNT DIAGRAM DRAWING
    public static void addOrExtendSegment(List<ExecutionSegment> ganttChart, int pid, int startTime, int endTime) {
        if (!ganttChart.isEmpty()) {
            ExecutionSegment last = ganttChart.get(ganttChart.size() - 1);

            if (last.getPid() == pid && last.getEndTime() == startTime) {
                last.setEndTime(endTime);
                return;
            }
        }
        ganttChart.add(new ExecutionSegment(pid, startTime, endTime));
    }
    // HELPER METHOD TO BUILD THE RESULT OF THE ALGORITHMS
    public static SchedulingResult buildResult(List<Process> processes, List<ExecutionSegment> ganttChart, int currentTime) {
        // RESULT
        int totalWT = 0;
        int totalTAT = 0;
        int totalBurstTime = 0;

        for (Process p : processes) {
            totalWT += p.getWaitTime();
            totalTAT += p.getTurnAroundTime();
            totalBurstTime += p.getBurstTime();
        }

        double averageWT = processes.isEmpty() ? 0 : totalWT / (double) processes.size();
        double averageTAT = processes.isEmpty() ? 0 : totalTAT / (double) processes.size();

        int totalTime = currentTime;
        double cpuUtilization = totalTime == 0 ? 0 : (totalBurstTime * 100.0) / totalTime;
        double throughput = totalTime == 0 ? 0 : processes.size() / (double) totalTime;

        return new SchedulingResult(processes, ganttChart, totalWT, totalTAT,
                averageWT, averageTAT, cpuUtilization, throughput);
    }
}