import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemberList from './components/MemberList';
import NewMemberForm from './components/NewMemberForm';
import UpdateMemberForm from './components/UpdateMemberForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import NavigationBar from './components/NavigationBar';

const App = () => {
  console.log(localStorage.getItem('token'));
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    const payload = parseJwt(token);
    if (payload.exp) {
      const expiryDate = new Date(payload.exp * 1000);
      console.log('토큰 만료 시간:', expiryDate.toLocaleString());
    } else {
      console.log('토큰에 만료 시간이 없습니다.');
    }
  } else {
    console.log('토큰이 없습니다.');
  }
  
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<MemberList />} />
        <Route path="/new" element={<NewMemberForm />} />
        <Route path="/edit/:id" element={<UpdateMemberForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
};

export default App;
