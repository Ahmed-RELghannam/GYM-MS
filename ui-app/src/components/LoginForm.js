import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import './css/LoginForm.css'; // استيراد ملف CSS المخصص

const LoginForm = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error message

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/api/login/', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, uid, user_type } = response.data; // الحصول على user_type من استجابة الخادم

      if (token && uid) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userUID', uid);
        localStorage.setItem('userType', user_type); // حفظ user_type في localStorage
        setToken(token);
        navigate('/');
      } else {
        setErrorMessage('Login failed: No token or UID received.'); // Error message if no token or UID
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        setErrorMessage('No response from server. Please try again later.');
      } else {
        setErrorMessage('Login failed. Please check your network connection.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <Card className="p-4 shadow-lg rounded-3d">
            <h2 className="text-center mb-4">Login</h2>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
              </Button>
            </Form>
            <div className="text-center mt-3">
              <a href="/password-reset-request">Forget my password</a>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
