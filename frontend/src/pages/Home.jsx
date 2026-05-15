import React from 'react';
import nluLogo from '../assets/nlu-logo.png'; 

export default function Home() {
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
        <img src={nluLogo} alt="Logo NLU" className="home-logo" />
        <div className="home-header-text">
          <h2 className="home-school">TRƯỜNG ĐẠI HỌC NÔNG LÂM THÀNH PHỐ HỒ CHÍ MINH</h2>
          <p style={{ margin: 0, color: '#666' }}>Đồ án tốt nghiệp - Hệ thống nông nghiệp thông minh</p>
        </div>
      </div>

      {/* Phần Tên đề tài đã được căn giữa và viết hoa */}
      <h3 className="section-title" style={{ textAlign: 'center', textTransform: 'uppercase' }}>
        Tên đề tài
      </h3>
      <p style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
        Điều khiển và giám sát trọng lượng mẫu sấy trên mô hình sấy thí nghiệm.
      </p>

      <h3 className="section-title">Thông tin sinh viên</h3>
      <div className="info-grid">
        <div className="info-item"><strong>Họ và tên:</strong> Nguyễn Đức Huy</div>
        <div className="info-item"><strong>Mã số sinh viên:</strong> 22138038</div>
        <div className="info-item"><strong>Lớp:</strong> DH22TD</div>
        <div className="info-item"><strong>Ngành:</strong> Kỹ thuật điều khiển và tự động hóa</div>
      </div>

      <h3 className="section-title">Giảng viên hướng dẫn</h3>
      <p style={{ textAlign: 'left', paddingLeft: '5px' }}>TS. Đào Duy Vinh</p>

      <h3 className="section-title">Phương thức liên lạc</h3>
      <div className="info-grid">
        <div className="info-item"><strong>Gmail:</strong> nguyenduchuy23022004@gmail.com</div>
        <div className="...">
  <strong>Facebook:</strong> 
  <a 
    href="https://www.facebook.com/share/1G7wbduQN7/?mibextid=wwXIfr" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: 'inherit', textDecoration: 'none' }} // Giữ nguyên màu chữ, không gạch chân
  >
    Trang Facebook cá nhân
  </a>
</div>
        <div className="info-item"><strong>Zalo:</strong> 0868489949</div>
        <div className="info-item"><strong>Số điện thoại:</strong> 0868489949</div>
      </div>
    </div>
  );
}