export default function Home() {
  return (
    <div className="card home-page">
      <div className="home-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/7/79/Nong_Lam_University_logo.png"
          alt="Logo Trường Đại học Nông Lâm TP.HCM"
          className="home-logo"
        />

        <div>
          <h2 className="home-school">TRƯỜNG ĐẠI HỌC NÔNG LÂM TP.HCM</h2>
          <p className="home-faculty">
            Đồ án tốt nghiệp - Hệ thống nông nghiệp thông minh
          </p>
        </div>
      </div>

      <div className="home-section">
        <h3 className="section-title">Tên đề tài</h3>
        <p className="home-text">
          Điều khiển và giám sát trọng lượng mẫu sấy trên mô hình sấy thí nghiệm.
        </p>
      </div>

      <div className="home-section">
        <h3 className="section-title">Thông tin sinh viên</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Họ và tên:</strong> Nguyễn Đức Huy
          </div>
          <div className="info-item">
            <strong>Mã số sinh viên:</strong> 22138038
          </div>
          <div className="info-item">
            <strong>Lớp:</strong> DH22TD
          </div>
          <div className="info-item">
            <strong>Ngành:</strong> Kỹ thuật điều khiển và tự động hóa
          </div>
        </div>
      </div>

      <div className="home-section">
        <h3 className="section-title">Giảng viên hướng dẫn</h3>
        <p className="home-text">
          <strong>TS. Đào Duy Vinh</strong>
        </p>
      </div>

      <div className="home-section">
        <h3 className="section-title">Phương thức liên lạc</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Gmail:</strong> nguyenduchuy23022004@gmail.com
          </div>
          <div className="info-item">
            <strong>Facebook:</strong>{" "}
            <a
              href="https://www.facebook.com/share/1G7wbduQN7/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
            >
              Trang Facebook cá nhân
            </a>
          </div>
          <div className="info-item">
            <strong>Zalo:</strong> 0868489949
          </div>
          <div className="info-item">
            <strong>Số điện thoại:</strong> 0868489949
          </div>
        </div>
      </div>

      <div className="home-section">
        <h3 className="section-title">Giới thiệu</h3>
        <p className="home-text">
          Website này được xây dựng nhằm phục vụ việc giám sát và điều khiển tủ
          sấy nấm theo thời gian thực. Hệ thống cho phép theo dõi nhiệt độ,
          khối lượng, trạng thái hoạt động của thiết bị và điều chỉnh chế độ
          sấy trực tiếp từ giao diện web.
        </p>
      </div>
    </div>
  );
}