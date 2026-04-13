

export default function Home() {
  return (
    <div className="card home-page">
      <div className="home-header">
        <img 
         src="https://upload.wikimedia.org/wikipedia/commons/7/79/Nong_Lam_University_logo.png"
          alt="Logo Trường Đại học Nông Lâm TP.HCM"
          className="home-logo" />
        <div>
          <h2 className="home-school">TRƯỜNG ĐẠI HỌC NÔNG LÂM TP.HCM</h2>
          <p className="home-faculty">Đồ án tốt nghiệp / Hệ thống nông nghiệp thông minh</p>
        </div>
      </div>

      <div className="home-section">
        <h3 className="section-title">Tên đồ án</h3>
        <p className="home-text">
          HỆ THỐNG GIÁM SÁT VÀ ĐIỀU KHIỂN TỦ SẤY NẤM THÔNG MINH
        </p>
      </div>

      <div className="home-section">
        <h3 className="section-title">Thông tin sinh viên</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Họ và tên:Nguyễn Đức Huy</strong> TEN_SINH_VIEN
          </div>
          <div className="info-item">
            <strong>Mã số sinh viên:22138038</strong> MSSV_CUA_BAN
          </div>
          <div className="info-item">
            <strong>Lớp:DH22TD</strong> LOP_CUA_BAN
          </div>
          <div className="info-item">
            <strong>Ngành: Kỹ thuật điều khiển và tự động hóa</strong> NGANH_CUA_BAN
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
            <strong>Gmail:nguyenduchuy23022004@gmail.com</strong> GMAIL_CUA_BAN
          </div>
          <div className="info-item">
            <strong>Facebook: https://www.facebook.com/share/1G7wbduQN7/?mibextid=wwXIfr </strong> FACEBOOK_CUA_BAN
          </div>
          <div className="info-item">
            <strong>Zalo:0868489949</strong> ZALO_CUA_BAN
          </div>
          <div className="info-item">
            <strong>Số điện thoại:0868489949</strong> SDT_CUA_BAN
          </div>
        </div>
      </div>

      <div className="home-section">
        <h3 className="section-title">Giới thiệu</h3>
        <p className="home-text">
          Website này được xây dựng nhằm phục vụ việc giám sát và điều khiển tủ sấy nấm
          theo thời gian thực. Hệ thống cho phép theo dõi nhiệt độ, khối lượng, trạng thái
          hoạt động của thiết bị và điều chỉnh chế độ sấy trực tiếp từ giao diện web.
        </p>
      </div>
    </div>
  );
}