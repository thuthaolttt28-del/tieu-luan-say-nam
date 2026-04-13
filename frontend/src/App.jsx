import { Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Control from "./pages/Control";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="container">
      <h1 className="title">HỆ THỐNG GIÁM SÁT VÀ ĐIỀU KHIỂN TỦ SẤY NẤM</h1>
      <p className="subtitle">Chủ đề: Nông nghiệp thông minh - Smart Agriculture</p>

      <div className="nav">
        <Link to="/">
          <button>Trang chủ</button>
        </Link>

        <Link to="/dashboard">
          <button>Giám sát</button>
        </Link>

        <Link to="/control">
          <button>Điều khiển</button>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/control" element={<Control />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}