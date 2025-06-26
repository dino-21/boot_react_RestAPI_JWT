import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const NewMemberForm = () => {
  const [member, setMember] = useState({
    name: '',
    age: '',
    phone: '',
    address: ''
  });

  const navigate = useNavigate();

  // 로그인 체크 및 리디렉션
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 글을 작성할 수 있습니다.');
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    const decoded = jwtDecode(token);
    const username = decoded.sub;

    const memberWithUser = {
      ...member,
      createdBy: username,
    };

    axios.post('http://localhost:8080/api/members', memberWithUser, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        alert("저장 완료!");
        navigate('/');
      })
      .catch(error => {
        console.error('저장 실패:', error);
        alert("저장 실패");
      });
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">새 회원 등록</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formName">
          <Form.Label column sm={2}>Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formAge">
          <Form.Label column sm={2}>Age</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              name="age"
              value={member.age}
              onChange={handleChange}
              placeholder="나이를 입력하세요"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formPhone">
          <Form.Label column sm={2}>Phone</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="phone"
              value={member.phone}
              onChange={handleChange}
              placeholder="전화번호를 입력하세요"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formAddress">
          <Form.Label column sm={2}>Address</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="address"
              value={member.address}
              onChange={handleChange}
              placeholder="주소를 입력하세요"
              required
            />
          </Col>
        </Form.Group>

        <div className="text-end">
          <Button variant="primary" type="submit">저장</Button>
        </div>
      </Form>
    </Container>
  );
};

export default NewMemberForm;
