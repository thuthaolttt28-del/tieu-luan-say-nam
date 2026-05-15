import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API = "https://tieu-luan-say-nam-api.onrender.com";

export default function Dashboard() {
  const [deviceState, setDeviceState] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchAllData = useCallback(async () => {
    try {
      const now = Date.now();

      const [stateRes, telemetryRes] = await Promise.all([
        axios.get(`${API}/api/state`, {
          params: { t: now },
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }),
        axios.get(`${API}/api/telemetry`, {
          params: { t: now },
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }),
      ]);

      setDeviceState(stateRes.data);
      setTelemetry(Array.isArray(telemetryRes.data) ? telemetryRes.data : []);
      setLastUpdated(new Date().toLocaleString());
      setError("");
    } catch (err) {
      console.error("Lỗi fetch dashboard:", err);
      setError("Không lấy được dữ liệu từ server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    const timer = setInterval(() => {
      fetchAllData();
    }, 2000);

    return () => clearInterval(timer);
  }, [fetchAllData]);

  const exportExcel = () => {
    const excelData = telemetry.map((item) => ({
      "Thời gian": new Date(item.created_at).toLocaleString(),
      "Nhiệt độ": item.temperature,
      "Khối lượng": item.weight,
      "Loại dữ liệu": item.source_action,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Du lieu say nam");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "du_lieu_say_nam.xlsx");
  };

  const exportTxt = () => {
    const txtData = telemetry
      .map(
        (item) =>
          `Thời gian: ${new Date(item.created_at).toLocaleString()} | Nhiệt độ: ${item.temperature} | Khối lượng: ${item.weight} | Loại dữ liệu: ${item.source_action}`
      )
      .join("\n");

    const blob = new Blob([txtData], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, "du_lieu_say_nam.txt");
  };

  const clearData = async () => {
    const ok = window.confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu không?");
    if (!ok) return;

    try {
      await axios.delete(`${API}/api/telemetry`);
      await fetchAllData();
      alert("Đã xóa dữ liệu thành công");
    } catch (err) {
      console.error(err);
      alert("Xóa dữ liệu thất bại");
    }
  };

  const chartData = telemetry.map((item) => ({
    time: new Date(item.created_at).toLocaleTimeString(),
    temperature: item.temperature,
    weight: item.weight,
  }));

  if (loading) {
    return (
      <div className="card">
        <h2 className="section-title">Trang giám sát</h2>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2 className="section-title">Trang giám sát</h2>
        <p>{error}</p>
        <button onClick={fetchAllData}>Thử tải lại</button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2 className="section-title">Trang giám sát</h2>

        <p className="refresh-text">
          <strong>Cập nhật lần cuối:</strong> {lastUpdated || "Chưa có"}
        </p>

        <div style={{ marginBottom: 20 }}>
          <button onClick={fetchAllData}>Làm mới dữ liệu</button>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <strong>Chế độ:</strong> {deviceState?.mode}
          </div>
          <div className="info-item">
            <strong>Chương trình:</strong> {deviceState?.program_state}
          </div>
          <div className="info-item">
            <strong>Quạt:</strong> {deviceState?.fan}
          </div>
          <div className="info-item">
            <strong>Điện trở:</strong> {deviceState?.heater}
          </div>
          <div className="info-item">
            <strong>Nhiệt độ đặt:</strong> {deviceState?.heater_temp} °C
          </div>
          <div className="info-item">
            <strong>Thời gian sấy:</strong> {deviceState?.dry_time} phút
          </div>
          <div className="info-item">
            <strong>Trạng thái tủ:</strong> {deviceState?.cabinet_status}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="action-row">
          <button onClick={exportExcel}>Xuất Excel</button>
          <button onClick={exportTxt}>Xuất TXT</button>
          <button onClick={clearData}>Xóa dữ liệu</button>
        </div>

        <h3 className="section-title">Đồ thị nhiệt độ</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" name="Nhiệt độ" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <h3 className="section-title">Đồ thị khối lượng</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" name="Khối lượng" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Dữ liệu cảm biến</h3>

        {telemetry.length === 0 ? (
          <p>Chưa có dữ liệu telemetry.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Nhiệt độ</th>
                  <th>Khối lượng</th>
                  <th>Loại dữ liệu</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>{item.temperature ?? ""}</td>
                    <td>{item.weight ?? ""}</td>
                    <td>{item.source_action ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}