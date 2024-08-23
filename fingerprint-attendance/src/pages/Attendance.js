import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Form, Button, Pagination } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import bluetoothService from '../services/bluetoothService';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [lcdDisplay, setLcdDisplay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/attendance');
        setAttendanceData(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch attendance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
    const interval = setInterval(fetchAttendance, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const connectBluetooth = async () => {
      try {
        await bluetoothService.connect();
        setLcdDisplay('Connected to Bluetooth device');
      } catch (err) {
        setError('Failed to connect to Bluetooth device: ' + err.message);
      }
    };

    connectBluetooth();

    const interval = setInterval(async () => {
      try {
        const fingerprint = await bluetoothService.getFingerprint();
        setLcdDisplay(`Last scan: ID ${fingerprint.id} at ${fingerprint.timestamp.toLocaleTimeString()}`);
        // Send this data to your backend
        await axios.post('/api/attendance', { fingerprintId: fingerprint.id });
      } catch (err) {
        console.error('Failed to get fingerprint:', err);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      bluetoothService.disconnect();
    };
  }, []);

  const filteredData = attendanceData.filter(student =>
    student.name.toLowerCase().includes(filter.toLowerCase()) ||
    student.id.toString().includes(filter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Today's Attendance</h1>
      
      <Alert variant="info" className="mb-4">
        LCD Display: {lcdDisplay}
      </Alert>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="mb-4">
        <Form.Group controlId="filterAttendance">
          <Form.Label>Search Students:</Form.Label>
          <div className="d-flex">
            <Form.Control
              type="text"
              placeholder="Enter name or ID"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <Button variant="outline-secondary" className="ml-2">
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </div>
        </Form.Group>
      </Form>

      {loading ? (
        <div className="text-center">
          <FontAwesomeIcon icon={faSync} spin size="3x" />
          <p className="mt-2">Loading attendance data...</p>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Time In</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.timeIn}</td>
                  <td>{student.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {[...Array(Math.ceil(filteredData.length / itemsPerPage))].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default Attendance;