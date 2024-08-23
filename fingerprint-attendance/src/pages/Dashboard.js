import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faClipboardCheck, faClock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    averageAttendance: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faUsers} size="3x" className="mb-3 text-primary" />
              <Card.Title>Total Students</Card.Title>
              <Card.Text className="h2">{stats.totalStudents}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faClipboardCheck} size="3x" className="mb-3 text-success" />
              <Card.Title>Present Today</Card.Title>
              <Card.Text className="h2">{stats.presentToday}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <FontAwesomeIcon icon={faClock} size="3x" className="mb-3 text-warning" />
              <Card.Title>Average Attendance</Card.Title>
              <Card.Text className="h2">{stats.averageAttendance}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;