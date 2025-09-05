const generateInvoiceHTML = (transaction, student, course) => {
  const invoiceDate = new Date(transaction.createdAt).toLocaleDateString('en-IN');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${transaction.billNo}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #003049;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #003049;
          margin: 0;
        }
        .header p {
          margin: 5px 0;
          color: #666;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .student-details, .invoice-info {
          width: 48%;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h3 {
          color: #003049;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        table th, table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        table th {
          background-color: #f8f9fa;
        }
        .total-row {
          font-weight: bold;
          background-color: #f8f9fa;
        }
        .terms {
          margin-top: 30px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .terms h4 {
          margin-top: 0;
          color: #003049;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Code i Technology</h1>
        <p>123 Education Street, Tech City - 700001</p>
        <p>Phone: +91 9876543210 | Email: info@codeitechnology.com</p>
      </div>
      
      <div class="invoice-details">
        <div class="student-details">
          <h3>Student Details</h3>
          <p><strong>Name:</strong> ${student.fullName}</p>
          <p><strong>Roll No:</strong> ${student.rollNumber}</p>
          <p><strong>Mobile:</strong> ${student.studentMobile}</p>
          <p><strong>Address:</strong> ${JSON.parse(student.localAddress).flatHouseNo}, ${JSON.parse(student.localAddress).street}, ${JSON.parse(student.localAddress).district}, ${JSON.parse(student.localAddress).state} - ${JSON.parse(student.localAddress).pincode}</p>
        </div>
        
        <div class="invoice-info">
          <h3>Invoice Details</h3>
          <p><strong>Bill No:</strong> ${transaction.billNo}</p>
          <p><strong>Date:</strong> ${invoiceDate}</p>
          <p><strong>Transaction ID:</strong> ${transaction.tid}</p>
        </div>
      </div>
      
      <div class="section">
        <h3>Course Details</h3>
        <table>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Course Name</th>
              <th>Duration</th>
              <th>Fee per Month</th>
              <th>Months Paid</th>
              <th>Total Fee</th>
              <th>Discount</th>
              <th>Net Payable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>${course.title}</td>
              <td>${course.duration} months</td>
              <td>₹${course.feePerMonth}</td>
              <td>${transaction.months}</td>
              <td>₹${transaction.amount + transaction.discount}</td>
              <td>₹${transaction.discount}</td>
              <td>₹${transaction.netPayable}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h3>Payment Details</h3>
        <p><strong>Mode of Payment:</strong> ${transaction.modeOfPayment}</p>
        <p><strong>Status:</strong> ${transaction.status}</p>
        ${transaction.paymentProofUrl ? `<p><strong>Payment Proof:</strong> <a href="${transaction.paymentProofUrl}" target="_blank">View Proof</a></p>` : ''}
      </div>
      
      <div class="terms">
        <h4>Terms & Conditions</h4>
        <ul>
          <li>Fee once paid is non-refundable/non-transferable</li>
          <li>Classes start next working day after demo class</li>
          <li>Certificate will be provided only after course completion</li>
          <li>Institute reserves the right to make changes to the schedule</li>
        </ul>
      </div>
      
      <div class="footer">
        <p>Thank you for choosing Code i Technology!</p>
        <p>This is a computer generated invoice and does not require a signature.</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="background-color: #003049; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Print Invoice
        </button>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateInvoiceHTML
};