import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

// JWT 토큰에서 username 추출 함수
function getUsernameFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;  // JWT payload 구조에 따라 다를 수 있음
  } catch (e) {
    return null;
  }
}

function MemberList() {
  const [members, setMembers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const username = getUsernameFromToken();  // 현재 로그인 사용자명
  const navigate = useNavigate();

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage]);

  // 페이지별 멤버 데이터 가져오기
  const fetchPage = (page) => {
    axios.get(`http://localhost:8080/api/members?page=${page}&size=3`)
      .then(res => {
        setMembers(res.data.content);
        setPageInfo({ number: res.data.number, totalPages: res.data.totalPages });
      })
      .catch(err => {
        console.error("회원 목록 조회 에러:", err);
        alert("회원 목록 조회 중 오류가 발생했습니다.");
      });
  };

  // 페이지 번호 클릭 시
  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // 수정 버튼 클릭 시 권한 체크 후 이동
  const handleEdit = (member) => {
    if (member.createdBy !== username) {
      alert("권한이 없습니다. 작성자만 수정할 수 있습니다.");
      return;
    }
    navigate(`/edit/${member.id}`);
  };

  // 삭제 버튼 클릭 시 권한 체크 후 삭제 요청
  const handleDelete = (member) => {
    if (member.createdBy !== username) {
      alert("권한이 없습니다. 작성자만 삭제할 수 있습니다.");
      return;
    }
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios.delete(`http://localhost:8080/api/members/${member.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(() => {
        alert("삭제 완료!");
        fetchPage(currentPage);
      })
      .catch(err => {
        console.error("삭제 에러:", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>회원 목록</h2>
        <Link to="/new">
          <Button variant="primary">+ 새 회원 등록</Button>
        </Link>
      </div>

      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>AGE</th>
            <th>PHONE</th>
            <th>ADDRESS</th>
            <th>작성자</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {members.map(member => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.age}</td>
              <td>{member.phone}</td>
              <td>{member.address}</td>
              <td>{member.createdBy || '-'}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(member)}>수정</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(member)}>삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-3">
        {Array.from({ length: pageInfo.totalPages }, (_, i) => (
          <Button
            key={i}
            variant={i === pageInfo.number ? 'dark' : 'outline-dark'}
            className="mx-1"
            onClick={() => handlePageClick(i)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default MemberList;
