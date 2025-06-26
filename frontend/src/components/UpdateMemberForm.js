import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateMemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({
    id: '',
    name: '',
    age: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:8080/api/members/${id}`)
      .then(res => setMember(res.data))
      .catch(err => {
        alert("회원 조회 실패");
        console.error(err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // 또는 sessionStorage.getItem("token")
  
    axios.put(`http://localhost:8080/api/members/${id}`, member, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        alert("수정 완료!");
        navigate('/');
      })
      .catch(err => {
        alert("수정 실패");
        console.error("에러 내용:", err.response?.data || err.message);
      });
  };
  
  return (
    <Container className="mt-5">
      <h2 className="mb-4"> 회원 정보 수정</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Control type="hidden" name="id" value={member.id} />

        <Form.Group as={Row} className="mb-3" controlId="formName">
          <Form.Label column sm={2}>Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
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
              required
            />
          </Col>
        </Form.Group>

        <div className="text-end">
          <Button variant="success" type="submit">저장</Button>
        </div>
      </Form>
    </Container>
  );
};

export default UpdateMemberForm;
