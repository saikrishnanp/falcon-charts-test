import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import RechartsDemo from "./pages/RechartsDemo/RechartsDemo";
import NivoDemo from "./pages/NivoDemo/NivoDemo";
import NivoCanvasDemo from "./pages/NivoDemo/NivoCanvasDemo";
import ChartJSDemo from "./pages/ChartJSDemo/ChartJSDemo";
import VisXDemo from "./pages/VisXDemo/VisXDemo";
import VictoryDemo from "./pages/VictoryDemo/VictoryDemo";
import EChartsDemo from "./pages/EChartsDemo/EChartsDemo";
// import ApexChartsDemo from "./pages/ApexChartsDemo/ApexChartsDemo";
// import HighchartsDemo from "./pages/HighchartsDemo/HighchartsDemo";

function App() {
  const tabs = [
    { path: "/recharts", label: "Recharts" },
    { path: "/nivo", label: "Nivo" },
    { path: "/nivo-canvas", label: "Nivo (Canvas)" },
    { path: "/chartjs", label: "Chart.js (Canvas)" },
    { path: "/victory", label: "Victory" },
    { path: "/echarts", label: "ECharts (Canvas)" },
    { path: "/visx", label: "VisX" },
    { path: "/apex", label: "ApexCharts" },
    { path: "/highcharts", label: "Highcharts" },
  ];

  return (
    <Router>
      <div className="app">
        <nav
          style={{
            display: "flex",
            gap: "1rem",
            padding: "1rem",
            borderBottom: "1px solid #ccc",
          }}
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              style={({ isActive }: { isActive: boolean }) => ({
                padding: "0.5rem 1rem",
                textDecoration: "none",
                borderRadius: "6px",
                background: isActive ? "#007bff" : "#f5f5f5",
                color: isActive ? "#fff" : "#333",
              })}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/recharts" element={<RechartsDemo />} />
            <Route path="/nivo" element={<NivoDemo />} />
            <Route path="/nivo-canvas" element={<NivoCanvasDemo />} />
            <Route path="/chartjs" element={<ChartJSDemo />} />
            <Route path="/visx" element={<VisXDemo />} />
            <Route path="/victory" element={<VictoryDemo />} />
            <Route path="/echarts" element={<EChartsDemo />} />
            <Route
              path="/apex"
              element={<div>Apex charts not added yet</div>}
            />
            <Route
              path="/highcharts"
              element={<div>Highcharts not added yet</div>}
            />
            <Route
              path="*"
              element={<div>Select a chart library tab above</div>}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
