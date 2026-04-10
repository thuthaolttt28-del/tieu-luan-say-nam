import { useEffect, useState } from "react";
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

const API = "http://localhost:10000";

export default function Dashboard() {
  const [deviceState, setDeviceState] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllData = async () => {
    try {
      setError("");

      const [stateRes, telemetryRes] = await Promise.all([
        axios.get(`${API}/api/state`),
        axios.get(`${API}/api/telemetry`),
      ]);

      setDeviceState(stateRes.data);
      setTelemetry(telemetryRes.data);
    } catch (err) {
      console.error(err);
      setError("Không lấy được dữ liệu từ backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const timer = setInterval(fetchAllData, 3000);
    return () => clearInterval(timer);
  }, []);

  const chartData = telemetry.map((item) => ({
    id: item.id,
    time: new Date(item.created_at).toLocaleTimeString(),
    fullTime: new Date(item.created_at).toLocaleString(),
    temperature: item.temperature,
    weight: item.weight,
    source_action: item.source_action,
  }));

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
          `Thoi gian: ${new Date(item.created_at).toLocaleString()} | Nhiet do: ${item.temperature} | Khoi luong: ${item.weight} | Loai du lieu: ${item.source_action}`
      )
      .join("\n");

    const blob = new Blob([txtData], {
      type: "text/plain;charset=utf-8",
    });

    saveAs(blob, "du_lieu_say_nam.txt");
  };

  const clearData = async () => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa toàn bộ dữ liệu không?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/api/telemetry`);
      await fetchAllData();
      alert("Đã xóa dữ liệu thành công");
    } catch (err) {
      console.error(err);
      alert("Xóa dữ liệu thất bại");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Trang giám sát</h2>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Trang giám sát</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Trang giám sát</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 500, marginBottom: 30 }}>
        <div><strong>Chế độ:</strong> {deviceState?.mode}</div>
        <div><strong>Chương trình:</strong> {deviceState?.program_state}</div>
        <div><strong>Quạt:</strong> {deviceState?.fan}</div>
        <div><strong>Điện trở:</strong> {deviceState?.heater}</div>
        <div><strong>Nhiệt độ đặt:</strong> {deviceState?.heater_temp} °C</div>
        <div><strong>Thời gian sấy:</strong> {deviceState?.dry_time} phút</div>
        <div><strong>Trạng thái tủ:</strong> {deviceState?.cabinet_status}</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={exportExcel}>Xuất Excel</button>
        <button onClick={exportTxt}>Xuất TXT</button>
        <button onClick={clearData}>Xóa dữ liệu</button>
      </div>

      <h3>Đồ thị nhiệt độ</h3>
      <div style={{ width: "100%", height: 300, marginBottom: 40 }}>
        <ResponsiveContainer>
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

      <h3>Đồ thị khối lượng</h3>
      <div style={{ width: "100%", height: 300, marginBottom: 40 }}>
        <ResponsiveContainer>
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

      <h3>Dữ liệu cảm biến</h3>

      {telemetry.length === 0 ? (
        <p>Chưa có dữ liệu telemetry.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
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
      )}
    </div>
  );
}