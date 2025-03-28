import React from 'react';
import '../styles/SampleRequestTable.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const mockSARs = [
  { sarNumber: 'SAR-JOH-D-00001', customer: 'Customer A', date: '2024-06-01', samples: 3, status: 'Pending' },
  { sarNumber: 'SAR-JOH-D-00002', customer: 'Customer B', date: '2024-06-03', samples: 2, status: 'Pending' },
  { sarNumber: 'SAR-JOH-D-00003', customer: 'Customer C', date: '2024-06-05', samples: 1, status: 'Pending' }
];

function SampleRequestTable() {
  const navigate = useNavigate();

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const exportToExcel = () => {
    const exportData = mockSARs.map((sar, index) => ({
      '#': index + 1,
      'SAR Number': sar.sarNumber,
      'Customer': sar.customer,
      'Date': new Date(sar.date),
      'Samples': sar.samples,
      'Status': sar.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, { cellDates: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample Requests');

    // Get headers
    const header = Object.keys(exportData[0]);

    // Bold and center headers with border
    header.forEach((key, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!worksheet[cellAddress]) return;
      worksheet[cellAddress].s = {
        font: { bold: true },
        alignment: { horizontal: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    });

    // Auto column width
    worksheet['!cols'] = header.map(h => ({ wch: h.length + 5 }));

    // Format Date and Samples columns
    for (let R = 1; R <= mockSARs.length; ++R) {
      const dateCell = worksheet[XLSX.utils.encode_cell({ r: R, c: 3 })];
      if (dateCell) dateCell.z = XLSX.SSF._table[14];

      const numCell = worksheet[XLSX.utils.encode_cell({ r: R, c: 4 })];
      if (numCell) {
        numCell.t = 'n';
        numCell.z = '0';
      }
    }

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sample_Request_Table.xlsx');
  };

  const exportToCSV = () => {
    const exportData = mockSARs.map((sar, index) => ({
      '#': index + 1,
      'SAR Number': sar.sarNumber,
      'Customer': sar.customer,
      'Date': formatDate(sar.date),
      'Samples': sar.samples,
      'Status': sar.status
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    saveAs(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'Sample_Request_Table.csv');
  };

  return (
    <div className="sar-table-container">
      <div className="sar-table-header">
        <h2>Sample Request Submitted</h2>
        <button className="back-button" onClick={() => navigate('/sample-analysis-request')}>
          ← Back to SAR Form
        </button>
      </div>

      <div className="export-buttons">
        <button onClick={exportToExcel}>Export to Excel</button>
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>

      <table className="sar-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SAR Number</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Samples</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockSARs.map((sar, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{sar.sarNumber}</td>
              <td>{sar.customer}</td>
              <td>{formatDate(sar.date)}</td>
              <td>{sar.samples}</td>
              <td>{sar.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SampleRequestTable;
