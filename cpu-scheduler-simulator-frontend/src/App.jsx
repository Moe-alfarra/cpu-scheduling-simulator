import React, { useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Play,
  Plus,
  Trash2,
  Sparkles,
  Activity,
  Gauge,
  Clock3,
  BarChart3,
  RefreshCw,
  Workflow,
  Layers3,
} from "lucide-react";

//const API_URL = "http://localhost:8080/api/schedule";
const API_URL = `${import.meta.env.VITE_API_URL}/api/schedule`; //Change if running backend locally/different host

const starterProcesses = [
  { pid: 1, arrivalTime: 0, burstTime: 5 },
  { pid: 2, arrivalTime: 1, burstTime: 3 },
  { pid: 3, arrivalTime: 2, burstTime: 8 },
  { pid: 4, arrivalTime: 3, burstTime: 6 },
];

const colors = [
  "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
  "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
  "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
];

function getProcessStyle(pid) {
  if (pid === 0) {
    return {
      background: "linear-gradient(135deg, #3f3f46 0%, #18181b 100%)",
      color: "#f4f4f5",
    };
  }
  const idx = (pid - 1) % colors.length;
  return {
    background: colors[idx],
    color: "#ffffff",
  };
}

function formatMetric(value, decimals = 2) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "0.00";
  return Number(value).toFixed(decimals);
}

function MetricCard({ icon: Icon, label, value, suffix, delay }) {
  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="metric-icon-wrap">
        <Icon size={18} />
      </div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">
          {value}
          <span>{suffix}</span>
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="section-title">
      <div className="section-title-icon">
        <Icon size={18} />
      </div>
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
  );
}

function GanttChart({ segments }) {
  const totalTime = useMemo(() => {
    if (!segments?.length) return 0;
    return Math.max(...segments.map((segment) => segment.endTime));
  }, [segments]);

  if (!segments?.length) {
    return (
      <div className="empty-state">
        <div className="empty-glow" />
        <Workflow size={28} />
        <h3>No schedule yet</h3>
        <p>Run the simulator to render the animated Gantt chart and process timeline.</p>
      </div>
    );
  }

  return (
    <div className="gantt-shell">
      <div className="gantt-track">
        {segments.map((segment, index) => {
          const duration = segment.endTime - segment.startTime;
          const widthPercent = totalTime ? (duration / totalTime) * 100 : 0;
          const style = getProcessStyle(segment.pid);

          return (
            <motion.div
              key={`${segment.pid}-${segment.startTime}-${segment.endTime}-${index}`}
              className="gantt-block"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, delay: index * 0.06 }}
              style={{
                width: `${Math.max(widthPercent, 4)}%`,
                minWidth: "64px",
                background: style.background,
                color: style.color,
              }}
            >
              <div className="gantt-block-title">
                {segment.pid === 0 ? "Idle" : `P${segment.pid}`}
              </div>

              <div className="gantt-block-subtitle">
                <span>{segment.startTime}</span>
                <span className="gantt-dash">-</span>
                <span>{segment.endTime}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="gantt-scale">
        {segments.map((segment, index) => {
          const duration = segment.endTime - segment.startTime;
          const widthPercent = totalTime ? (duration / totalTime) * 100 : 0;
          return (
            <div
              className="gantt-scale-item"
              key={`scale-${index}`}
              style={{ width: `${Math.max(widthPercent, 4)}%`,
                         minWidth: "64px", }}
            >
              <span className="gantt-time">{segment.startTime}</span>
              {index === segments.length - 1 ? (
                <span className="gantt-time gantt-time-end">{segment.endTime}</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="legend">
        {Array.from(new Set(segments.map((segment) => segment.pid))).map((pid) => {
          const style = getProcessStyle(pid);
          return (
            <div className="legend-item" key={`legend-${pid}`}>
              <span
                className="legend-dot"
                style={{ background: style.background }}
              />
              <span>{pid === 0 ? "Idle" : `Process ${pid}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [algorithm, setAlgorithm] = useState("FCFS");
  const [quantum, setQuantum] = useState(2);
  const [processes, setProcesses] = useState(starterProcesses);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addProcess = () => {
    const nextPid = processes.length ? Math.max(...processes.map((p) => p.pid)) + 1 : 1;
    setProcesses([...processes, { pid: nextPid, arrivalTime: 0, burstTime: 1 }]);
  };

  const removeProcess = (pid) => {
    if (processes.length === 1) return;
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  const updateProcess = (pid, field, value) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.pid === pid
          ? {
              ...p,
              [field]:
                field === "burstTime"
                  ? Math.max(1, Number(value) || 1)
                  : Math.max(0, Number(value) || 0),
            }
          : p
      )
    );
  };

  const loadDemo = () => {
    setProcesses(starterProcesses);
    setAlgorithm("FCFS");
    setQuantum(2);
    setResult(null);
    setError("");
  };

  const resetAll = () => {
    setProcesses([{ pid: 1, arrivalTime: 0, burstTime: 1 }]);
    setAlgorithm("FCFS");
    setQuantum(2);
    setResult(null);
    setError("");
  };

  const sortedPreview = useMemo(() => {
    return [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.pid - b.pid);
  }, [processes]);

  const runSimulation = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = {
        algorithm,
        quantum: algorithm === "RR" ? Number(quantum) : 0,
        processes: processes.map((p) => ({
          pid: Number(p.pid),
          arrivalTime: Number(p.arrivalTime),
          burstTime: Number(p.burstTime),
        })),
      };

      const response = await axios.post(API_URL, payload);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Make sure Spring Boot is running on http://localhost:8080 and your controller allows requests from http://localhost:5173."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateRandomProcesses = () => {
    const count = Math.floor(Math.random() * 3) + 2;

    const generated = Array.from({ length: count }, (_, index) => ({
      pid: index + 1,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 9) + 1,
    })).sort((a, b) => a.arrivalTime - b.arrivalTime || a.pid - b.pid);

    setProcesses(generated);
    setResult(null);
    setError("");
  };


  return (
    <div className="page">
      <div className="background-orb orb-1" />
      <div className="background-orb orb-2" />
      <div className="background-grid" />

      <main className="container">
        <motion.section
          className="hero glass"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
         <div className="hero-copy">
           <div className="badge">
             <Sparkles size={14} />
             CPU Scheduling Simulator
           </div>

           <h1>CPU Scheduling Simulator</h1>

           <p>
             Simulate FCFS, SJF, SRTF, and Round Robin with a Gantt chart visualization.
           </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={runSimulation} disabled={loading}>
                {loading ? <RefreshCw size={18} className="spin" /> : <Play size={18} />}
                {loading ? "Running..." : "Run Simulation"}
              </button>

              <button className="btn btn-secondary" onClick={loadDemo}>
                <Layers3 size={18} />
                Load Demo
              </button>
              <button className="btn btn-secondary" onClick={generateRandomProcesses}>
                <Sparkles size={18} />
                Random Processes
              </button>

              <button className="btn btn-ghost" onClick={resetAll}>
                Reset
              </button>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-top">
              <div className="chip">
                <Cpu size={15} />
                Backend API
              </div>
              <span className="api-url">POST /api/schedule</span>
            </div>

            <div className="mini-stats">
              <div className="mini-stat">
                <span>Algorithms</span>
                <strong>4</strong>
              </div>
              <div className="mini-stat">
                <span>Processes</span>
                <strong>{processes.length}</strong>
              </div>
              <div className="mini-stat">
                <span>Mode</span>
                <strong>{algorithm}</strong>
              </div>
            </div>

            <div className="preview-list">
              {sortedPreview.map((process) => (
                <div className="preview-item" key={`preview-${process.pid}`}>
                  <span>P{process.pid}</span>
                  <small>A{process.arrivalTime}</small>
                  <small>B{process.burstTime}</small>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="dashboard">
          <motion.div
            className="left-column"
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass panel">
              <SectionTitle
                icon={Activity}
                title="Simulation Input"
                subtitle="Configure the algorithm and build your process list."
              />

              <div className="form-grid">
                <label className="field">
                  <span>Algorithm</span>
                  <select
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                  >
                    <option value="FCFS">FCFS</option>
                    <option value="SJF">SJF</option>
                    <option value="SRTF">SRTF</option>
                    <option value="RR">Round Robin</option>
                  </select>
                </label>

                <label className="field">
                  <span>Quantum</span>
                  <input
                    type="number"
                    min="1"
                    value={quantum}
                    disabled={algorithm !== "RR"}
                    onChange={(e) => setQuantum(Math.max(1, Number(e.target.value) || 1))}
                  />
                </label>
              </div>

              <div className="input-toolbar">
                <h3>Processes</h3>
                <button className="btn btn-secondary small" onClick={addProcess}>
                  <Plus size={16} />
                  Add Process
                </button>
              </div>

              <div className="process-list">
                <AnimatePresence>
                  {processes.map((process, index) => (
                    <motion.div
                      layout
                      key={process.pid}
                      className="process-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div className="process-badge" style={getProcessStyle(process.pid)}>
                        P{process.pid}
                      </div>

                      <label className="field compact">
                        <span>Arrival</span>
                        <input
                          type="number"
                          min="0"
                          value={process.arrivalTime}
                          onChange={(e) =>
                            updateProcess(process.pid, "arrivalTime", e.target.value)
                          }
                        />
                      </label>

                      <label className="field compact">
                        <span>Burst</span>
                        <input
                          type="number"
                          min="1"
                          value={process.burstTime}
                          onChange={(e) =>
                            updateProcess(process.pid, "burstTime", e.target.value)
                          }
                        />
                      </label>

                      <button
                        className="icon-btn"
                        onClick={() => removeProcess(process.pid)}
                        disabled={processes.length === 1}
                        aria-label={`Remove process ${process.pid}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {error ? <div className="error-box">{error}</div> : null}
            </div>
          </motion.div>

          <div className="right-column">
            <motion.div
              className="glass panel"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SectionTitle
                icon={Workflow}
                title="Animated Gantt Chart"
                subtitle="Your backend execution segments appear here."
              />
              {loading ? (
                <div className="chart-loading">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton-track">
                    <div className="skeleton-block" />
                    <div className="skeleton-block" />
                    <div className="skeleton-block" />
                  </div>
                  <div className="skeleton-row">
                    <div className="skeleton-chip" />
                    <div className="skeleton-chip" />
                    <div className="skeleton-chip" />
                  </div>
                </div>
              ) : (
                <GanttChart segments={result?.ganttChart || []} />
              )}
            </motion.div>

            <motion.div
              className="glass panel"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <SectionTitle
                icon={Layers3}
                title="Per-Process Results"
                subtitle="Completion time, turnaround time, and waiting time."
              />

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>PID</th>
                      <th>Arrival</th>
                      <th>Burst</th>
                      <th>Completion</th>
                      <th>Turnaround</th>
                      <th>Waiting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(result?.processes || []).map((process) => (
                      <tr key={`row-${process.pid}`}>
                        <td>
                          <span className="table-pill" style={getProcessStyle(process.pid)}>
                            P{process.pid}
                          </span>
                        </td>
                        <td>{process.arrivalTime}</td>
                        <td>{process.burstTime}</td>
                        <td>{process.completionTime}</td>
                        <td>{process.turnAroundTime}</td>
                        <td>{process.waitTime}</td>
                      </tr>
                    ))}
                    {!result?.processes?.length ? (
                      <tr>
                        <td colSpan="6" className="table-empty">
                          Results will appear here after you run the simulation.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </motion.div>
               <div className="metrics-grid">
                  <MetricCard
                      icon={Clock3}
                      label="Average Waiting Time"
                      value={formatMetric(result?.averageWT)}
                      suffix=""
                      delay={0.04}
                  />
                  <MetricCard
                       icon={BarChart3}
                       label="Average Turnaround Time"
                       value={formatMetric(result?.averageTAT)}
                       suffix=""
                       delay={0.08}
                  />
                  <MetricCard
                       icon={Gauge}
                       label="CPU Utilization"
                       value={formatMetric(result?.cpuUtilization)}
                       suffix="%"
                       delay={0.12}
                  />
                  <MetricCard
                       icon={Activity}
                       label="Throughput"
                       value={formatMetric(result?.throughput)}
                       suffix=""
                       delay={0.16}
                  />
                </div>
          </div>
        </section>
      </main>
    </div>
  );
}

