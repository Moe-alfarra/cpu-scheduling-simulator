package com.moeAlfarra.cpu_scheduler_simulator.controller;

import com.moeAlfarra.cpu_scheduler_simulator.dto.SchedulingRequest;
import com.moeAlfarra.cpu_scheduler_simulator.model.SchedulingResult;
import com.moeAlfarra.cpu_scheduler_simulator.service.SchedulingAlgorithms;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin(origins = "\"https://your-frontend-name.vercel.app\"") // Change if running frontend locally/different host
public class SchedulingController {

    @PostMapping
    public SchedulingResult schedule(@RequestBody SchedulingRequest request) {
        switch (request.getAlgorithm()) {
            // First-Come-First-Serve
            case "FCFS":
                return SchedulingAlgorithms.fcfs(SchedulingAlgorithms.copyProcesses(request.getProcesses()));
            // Shortest-Job-First
            case "SJF":
                return SchedulingAlgorithms.sjf(SchedulingAlgorithms.copyProcesses(request.getProcesses()));
            //Shortest-Remaining-Time-First
            case "SRTF":
                return SchedulingAlgorithms.srtf(SchedulingAlgorithms.copyProcesses(request.getProcesses()));
            // Round-Robin
            case "RR":
                return SchedulingAlgorithms.roundRobin(
                        SchedulingAlgorithms.copyProcesses(request.getProcesses()),
                        request.getQuantum()
                );

            default:
                throw new RuntimeException("Invalid algorithm: " + request.getAlgorithm());
        }
    }
}