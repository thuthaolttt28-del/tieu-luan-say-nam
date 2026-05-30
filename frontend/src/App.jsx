import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/Home";

import Dashboard from "./pages/Dashboard";

import Control from "./pages/Control";



export default function App() {

  return (

    <div className="container">

      <h1 className="title">MÔ HÌNH GIÁM SÁT VÀ ĐIỀU KHIỂN TỦ SẤY NẤM</h1>

      <p className="subtitle">

        Chủ đề: Nông nghiệp thông minh - Smart Agriculture

      </p>



      <div className="student-box">

        <p>

          <strong>Sinh viên:</strong> Nguyễn Đức Huy

        </p>

        <p>

          <strong>Mã số sinh viên:</strong> 22138038

        </p>

      </div>



      <div className="nav">

        <Link to="/home">

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

        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/home" element={<Home />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/control" element={<Control />} />

      </Routes>

    </div>

  );

}