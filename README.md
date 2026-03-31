# CPU Scheduling Simulator

A full-stack **CPU Scheduling Simulator** that visualizes how different CPU scheduling algorithms execute processes.
The simulator provides an interactive interface for entering processes, running scheduling algorithms, and visualizing execution using a **Gantt chart**.

Hosted on Vercel: https://cpu-scheduling-simulator-umber.vercel.app/
---

## Tech Stack

### Frontend

* React
* Vite
* Framer Motion

### Backend

* Spring Boot
* Java

### Visualization

* Animated Gantt Chart
* Scheduling Metrics Dashboard

---

## Implemented Algorithms

The simulator currently supports:

* **First Come First Serve (FCFS)**
* **Shortest Job First (SJF)**
* **Shortest Remaining Time First (SRTF)**
* **Round Robin (RR)**

Each algorithm produces:

* Gantt Chart
* Average Waiting Time
* Average Turnaround Time
* CPU Utilization
* Throughput

---

## Project Structure

```
CPU-Scheduling-Simulator
│
├── cpu-scheduler-simulator-frontend
│
└── cpu-scheduler-simulator-backend
```

---

# Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cpu-scheduling-simulator.git
cd cpu-scheduling-simulator
```

---

## Run Backend (Spring Boot)

Navigate to the backend folder:

```bash
cd cpu-scheduler-simulator-backend
```

Run the Spring Boot server:

```bash
mvn spring-boot:run
```

The backend will start on:

```
http://localhost:8080
```

---

## Run Frontend (React + Vite)

Open a new terminal and navigate to the frontend folder:

```bash
cd cpu-scheduler-simulator-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

# Important Configuration

Before running the project locally, you must ensure the **frontend and backend API URLs match your environment**.

---

## Backend CORS Configuration

Inside the backend controller, update the allowed frontend origin.

Example in `SchedulingController`:

```java
@CrossOrigin(origins = {
    "http://localhost:5173"
})
```

If you deploy the frontend later (for example on Vercel), add the deployed URL as well:

```java
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app"
})
```

---

## Frontend API URL

Inside the frontend code, ensure the API points to the correct backend address.

Example in the React application:

```javascript
const API_URL = "http://localhost:8080/api/schedule";
```

If your backend is deployed, update it accordingly:

```javascript
const API_URL = "https://your-backend-domain/api/schedule";
```

---

## Local Development Summary

```
Frontend → http://localhost:5173
Backend → http://localhost:8080
```

The frontend communicates with the backend using:

```
http://localhost:8080/api/schedule
```

---

## Features

* Interactive process input
* Random process generator
* Animated Gantt chart visualization
* Real-time scheduling metrics
* Idle time handling
* Support for preemptive and non-preemptive algorithms

---

## Example Simulation Input

```
Process   Arrival   Burst
P1        0         4
P2        1         3
P3        2         2
P4        3         1
```

---

## Future Improvements

* Algorithm comparison mode
* Step-by-step scheduling animation
* Export results as CSV
* Additional scheduling algorithms

---

## Author

Mohammed Alfarra
Computer Science Graduate
