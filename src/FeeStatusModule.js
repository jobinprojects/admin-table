import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeeStatusModule.css';

const FeeStatusModule = ({ officer }) => {
  const [students, setStudents] = useState([]);
  const [sortColumn, setSortColumn] = useState('enrollmentNo');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    axios.get('https://localhost:7209/api/FeeStatus/students')
      .then((response) => setStudents(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleFeeStatusUpdate = (studentId, action, value) => {
    axios.patch(`/api/FeeStatus/students/${studentId}`, {
      action,
      value,
    })
      .then((response) => {
        const updatedStudent = response.data;
        setStudents((prevStudents) =>
          prevStudents.map((student) => (student.id === studentId ? updatedStudent : student))
        );
      })
      .catch((error) => console.error(error));
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const downloadProofOfPayment = (proofOfPaymentUrl, filename) => {
    const link = document.createElement('a');
    link.href = proofOfPaymentUrl;
    link.download = filename;
    link.target = '_blank';
    link.click();
  };

  const sortedStudents = [...students].sort((a, b) => {
    const valueA = getColumnValue(a, sortColumn);
    const valueB = getColumnValue(b, sortColumn);

    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getColumnValue = (student, column) => {
    switch (column) {
      case 'enrollmentNo':
        return student.enrollmentNo;
      case 'fullName':
        return student.fullName;
      case 'email':
        return student.email;
      case 'mobile':
        return student.mobile;
      case 'year':
        return student.year;
      case 'modeOfPayment':
        return student.paymentMode;
      case 'amount':
        return student.Amount;
      case 'feeStatus':
        return student.feeStatus;
      default:
        return '';
    }
  };

  const handleKeyPress = (event, studentId) => {
    if (event.key === 'Enter') {
      const inputValue = event.target.value.trim();
      handleFeeStatusUpdate(studentId, 'reject', inputValue);
    }
  };

  const handleSignup = () => {
    axios.post('https://localhost:7209/api/FeeStatus/signup')
      .then((response) => {
        // Handle the response from the signup API
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="fee-status-module">
      {/* Render the header section */}
      <header>
        {/* Display the officer details */}
        <div className="officer-details">
          <h3>{officer.name}</h3>
          <p>{officer.designation}</p>
        </div>
        {/* Render the logo and site name */}
        <div className="site-logo">
          <a href="#" title="Home">
            <img src="http://www.bvicam.in/sites/default/files/BVICAM%20red%20logo_2.png" alt="Home" />
          </a>
        </div>
        {/* Render the module name */}
        <h2>Fee Status</h2>
      </header>

      {/* Render the table */}
      <table className="student-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('enrollmentNo')}>
              Enrollment No. {sortColumn === 'enrollmentNo' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('fullName')}>
              Full Name {sortColumn === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('email')}>
              Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('mobile')}>
              Mobile {sortColumn === 'mobile' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('year')}>
              Year {sortColumn === 'year' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('modeOfPayment')}>
              Mode of Payment {sortColumn === 'modeOfPayment' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('amount')}>
              Amount {sortColumn === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('feeStatus')}>
              Fee Status {sortColumn === 'feeStatus' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th>Action</th>
            <th>Remarks</th>
            <th>Download Proof</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.enrollmentNo}</td>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.mobile}</td>
              <td>{student.year}</td>
              <td>{student.paymentMode}</td>
              <td>{student.Amount}</td>
              <td>{student.feeStatus}</td>
              <td className="select-action">
                <select
                  value={student.remarks || ''}
                  onChange={(e) => handleFeeStatusUpdate(student.id, e.target.value)}
                >
                  <option value="">Select Action</option>
                  <option value="accept">Accept</option>
                  <option value="reject">Reject</option>
                </select>
                {student.remarks === 'reject' && (
                  <input
                    type="text"
                    value={student.reason || ''}
                    onChange={(e) => handleFeeStatusUpdate(student.id, 'reject', e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, student.id)}
                    placeholder="Reason for rejection"
                  />
                )}
              </td>
              <td>{student.remarks}</td>
              <td>
                {/* Download button for proof of payment */}
                {student.proofOfPayment && (
                  <button
                    onClick={() => downloadProofOfPayment(student.proofOfPayment, `${student.fullName}_ProofOfPayment`)}
                    className="download-button" // Add CSS class to the button
                  >
                    Download
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeStatusModule;
