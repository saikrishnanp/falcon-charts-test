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
import VictoryDemo from "./pages/VictoryDemo/VictoryDemo";
import EChartsDemo from "./pages/EChartsDemo/EChartsDemo";
import PlotlyDemo from "./pages/PlotlyDemo/PlotlyDemo";
import D3Demo from "./pages/D3Demo/D3Demo";

function App() {
  const tabs = [
    { path: "/recharts", label: "Recharts" },
    { path: "/plotly", label: "React-plotly.js" },
    // { path: "/nivo", label: "Nivo" },
    { path: "/nivo-canvas", label: "Nivo (Canvas*)" },
    { path: "/chartjs", label: "Chart.js (Canvas)" },
    { path: "/victory", label: "Victory" },
    { path: "/echarts", label: "ECharts (Canvas)" },
    { path: "/d3", label: "D3" },
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
            <Route path="/victory" element={<VictoryDemo />} />
            <Route path="/echarts" element={<EChartsDemo />} />
            <Route path="/plotly" element={<PlotlyDemo />} />
            <Route path="/d3" element={<D3Demo />} />
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
