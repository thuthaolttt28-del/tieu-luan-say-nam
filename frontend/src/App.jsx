import { Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Control from "./pages/Control";

export default function App() {
  return (
    <div className="container">
      <h1 className="title">HỆ THỐNG GIÁM SÁT VÀ ĐIỀU KHIỂN TỦ SẤY NẤM</h1>
      <p className="subtitle">Chủ đề: Nông nghiệp thông minh - Smart Agriculture</p>

      <div className="student-box">
        <p><strong>Sinh viên:</strong> TEN_SINH_VIEN</p>
        <p><strong>Mã số sinh viên:</strong> MSSV_CUA_BAN</p>
      </div>

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