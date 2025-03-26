import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Last7Days } from "../../lib/feature";
// Register necessary ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);



// Sample data for Line Chart
const labels = Last7Days();
const lineData = {
  labels: labels,
  datasets: [
    {
      label: "User Growth",
      data: [10, 25, 40, 55, 70, 85, 100],
      borderColor: "#60A5FA",
      backgroundColor: "rgba(96, 165, 250, 0.3)",
      borderWidth: 3,
      pointRadius: 5,
      pointBackgroundColor: "#1E40AF",
      pointBorderColor: "#fff",
      fill: true,
    },
  ],
};

// Line Chart Component
const LineChart = () => {
  return (
    <Line
      data={lineData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            ticks: { beginAtZero: true },
          },
        },
        plugins: {
          title: { text: "User Growth Over Time" },
        },
      }}
    />
  );
};

// Sample data for Doughnut Chart
const doughnutData = {
  labels: ["Active Users", "Inactive Users", "New Signups"],
  datasets: [
    {
      data: [60, 30, 10],
      backgroundColor: ["#10B981", "#EF4444", "#3B82F6"],
      hoverBackgroundColor: ["#059669", "#DC2626", "#2563EB"],
      borderWidth: 2,
      offset:10
    },
  ],
};

// Doughnut Chart Component
const DoughnutChart = () => {
  return (
    <Doughnut
      data={doughnutData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { text: "User Engagement Breakdown" },
        },
      }}
    />
  );
};

export { LineChart, DoughnutChart };
