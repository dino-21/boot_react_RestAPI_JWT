import React from 'react';
import { Nav } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let username = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.sub;
    } catch (e) {
      console.error('토큰 해독 실패:', e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <Nav activeKey="/home" className="justify-content-end" style={{ padding: '10px' }}>
      <Nav.Item>
        <Nav.Link href="/">홈</Nav.Link>
      </Nav.Item>
      {token ? (
        <>
          <Nav.Item>
            <Nav.Link disabled>{username}님</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
          </Nav.Item>
        </>
      ) : (
        <>
          <Nav.Item>
            <Nav.Link href="/login">로그인</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/signup">회원가입</Nav.Link>
          </Nav.Item>
        </>
      )}
    </Nav>
  );
};

export default NavigationBar;
