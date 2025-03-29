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

  // Set the document title when component mounts
  React.useEffect(() => {
    document.title = "Samples Requests Submitted";
    return () => {
      // Reset title on unmount if needed
    };
  }, []);

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

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(exportData, { cellDates: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample Requests');

    // Get headers
    const header = Object.keys(exportData[0]);
    
    // Calculate column widths based on maximum content length
    const wscols = [];
    for (let i = 0; i < header.length; i++) {
      // Start with the header length + extra space
      let maxWidth = header[i].length + 2;
      
      // Check each row's cell width for this column
      exportData.forEach(row => {
        // Get the value from the row
        const key = header[i];
        const value = row[key];
        
        // Convert to string and get length
        const valueStr = value !== null && value !== undefined ? String(value) : '';
        
        // Special handling for dates - they format longer in Excel
        if (key === 'Date') {
          // Date will display like "01/01/2024" - approximately 10 chars
          maxWidth = Math.max(maxWidth, 12);
        } else {
          maxWidth = Math.max(maxWidth, valueStr.length + 2);
        }
      });
      
      // Add the width specification
      wscols.push({ wch: maxWidth });
    }
    
    // Apply the calculated column widths
    worksheet['!cols'] = wscols;

    // Format headers - make bold, center, and add light fill
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: C });
      
      // Set style for the cell
      if (!worksheet[headerCell].s) worksheet[headerCell].s = {};
      
      // Bold, centered headers with background
      worksheet[headerCell].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { patternType: 'solid', fgColor: { rgb: "E0E0E0" } },
        border: {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }

    // Format data cells
    for (let R = 1; R <= headerRange.e.r; ++R) {
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cell]) continue;
        
        // Create style object if needed
        if (!worksheet[cell].s) worksheet[cell].s = {};
        
        // Add borders to all cells
        worksheet[cell].s.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Format specific columns
        if (C === 0 || C === 4) { // # and Samples columns
          worksheet[cell].s.alignment = { horizontal: 'center' };
        } else if (C === 3) { // Date column
          worksheet[cell].z = 'dd/mm/yyyy';
        }
      }
    }
    
    // Generate the Excel file and trigger download
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
        <h2>Samples Requests Submitted</h2>
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