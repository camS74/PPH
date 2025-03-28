import React from 'react';
import '../styles/SampleAnalysisTable.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const mockSARs = [
  {
    sarNumber: 'SAR00001',
    customer: 'Customer A',
    salesRep: 'Admin',
    date: '2024-06-01',
    samples: 3
  },
  {
    sarNumber: 'SAR00002',
    customer: 'Customer B',
    salesRep: 'User Name',
    date: '2024-06-03',
    samples: 2
  },
  {
    sarNumber: 'SAR00003',
    customer: 'Customer A',
    salesRep: 'Ali Ahmed',
    date: '2024-06-05',
    samples: 1
  }
];

function SampleAnalysisTable() {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(mockSARs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SAR List');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'SAR_List.xlsx');
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(mockSARs);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'SAR_List.csv');
  };

  return (
    <div className="sar-table-container">
      <h2>Submitted SARs</h2>
      <div className="export-buttons">
        <button onClick={exportToExcel}>Export to Excel</button>
        <button onClick={exportToCSV}>Export to CSV</button>
      </div>
      <table className="sar-table">
        <thead>
          <tr>
            <th>SAR No</th>
            <th>Customer</th>
            <th>Sales Rep</th>
            <th>Date</th>
            <th>Samples</th>
          </tr>
        </thead>
        <tbody>
          {mockSARs.map((sar, index) => (
            <tr key={index}>
              <td>{sar.sarNumber}</td>
              <td>{sar.customer}</td>
              <td>{sar.salesRep}</td>
              <td>{sar.date}</td>
              <td>{sar.samples}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SampleAnalysisTable;
