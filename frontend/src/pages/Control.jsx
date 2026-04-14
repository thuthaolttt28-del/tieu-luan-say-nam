import { useEffect, useState } from "react";
import axios from "axios";

const API = window.location.origin;

export default function Control() {
  const [formData, setFormData] = useState({
    mode: "auto",
    program_state: "off",
    fan: "off",
    heater: "off",
    heater_temp: 45,
    dry_time_hours: 0,
  });

  const [message, setMessage] = useState("");

  const fetchState = async () => {
    try {
      const res = await axios.get(`${API}/api/state`, {
        params: { t: Date.now() },
      });

      const d = res.data;

      setFormData({
        mode: d.mode || "auto",
        program_state: d.program_state || "off",
        fan: d.fan || "off",
        heater: d.heater || "off",
        heater_temp: d.heater_temp ?? 45,
        dry_time_hours: d.dry_time ? d.dry_time / 60 : 0,
      });
    } catch (error) {
      console.error(error);
      setMessage("Không lấy được trạng thái hiện tại");
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API}/api/control`, {
        ...formData,
        heater_temp: Number(formData.heater_temp),
        dry_time: Number(formData.dry_time_hours) * 60,
        cabinet_status:
          formData.program_state === "on"
            ? formData.mode === "auto"
              ? "AUTO_DANG_CHAY"
              : "MANUAL_DANG_CHAY"
            : "TAT",
      });

      setMessage("Đã gửi lệnh thành công");
      fetchState();
    } catch (error) {
      console.error(error);
      setMessage("Gửi lệnh thất bại");
    }
  };

  return (
    <div>
      <div className="card">
        <h2 className="section-title">Trang điều khiển</h2>

        <div className="grid">
          <div>
            <label>Chế độ</label>
            <select name="mode" value={formData.mode} onChange={handleChange}>
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label>Trạng thái chương trình</label>
            <select
              name="program_state"
              value={formData.program_state}
              onChange={handleChange}
            >
              <option value="off">Tắt</option>
              <option value="on">Bật</option>
            </select>
          </div>

          <div>
            <label>Quạt</label>
            <select name="fan" value={formData.fan} onChange={handleChange}>
              <option value="off">Tắt</option>
              <option value="on">Bật</option>
            </select>
          </div>

          <div>
            <label>Điện trở đốt</label>
            <select
              name="heater"
              value={formData.heater}
              onChange={handleChange}
            >
              <option value="off">Tắt</option>
              <option value="on">Bật</option>
            </select>
          </div>

          <div>
            <label>Nhiệt độ đặt (°C)</label>
            <input
              type="number"
              name="heater_temp"
              value={formData.heater_temp}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Thời gian sấy (giờ)</label>
            <input
              type="number"
              name="dry_time_hours"
              value={formData.dry_time_hours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={handleSubmit}>Gửi lệnh điều khiển</button>
        </div>

        {message && (
          <p
            className={
              message.includes("thất bại") ? "message-error" : "message-ok"
            }
          >
            {message}
          </p>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Trạng thái hiện tại</h3>

        <div
          className={`status ${
            formData.program_state === "on" ? "running" : "stopped"
          }`}
        >
          {formData.program_state === "on" ? "ĐANG CHẠY" : "ĐANG TẮT"}
        </div>

        <div className="info-grid">
          <div className="info-item">
            <strong>Mode:</strong> {formData.mode}
          </div>
          <div className="info-item">
            <strong>Quạt:</strong> {formData.fan}
          </div>
          <div className="info-item">
            <strong>Điện trở:</strong> {formData.heater}
          </div>
          <div className="info-item">
            <strong>Nhiệt độ đặt:</strong> {formData.heater_temp} °C
          </div>
          <div className="info-item">
            <strong>Thời gian sấy:</strong> {formData.dry_time_hours} giờ
          </div>
        </div>
      </div>
    </div>
  );
}