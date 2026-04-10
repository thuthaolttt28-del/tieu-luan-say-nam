import { Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Control from "./pages/Control";

export default function App() {
  return (
    <div className="container">
      <h1 className="title">Tiểu luận sấy nấm</h1>

      <div className="nav">
        <Link to="/dashboard">
          <button>Giám sát</button>
        </Link>
        <Link to="/control">
          <button>Điều khiển</button>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/control" element={<Control />} />
      </Routes>
    </div>
  );
}