import { formatCurrency, formatDate, formatAddress } from './formatters';

export const generateInvoiceHTML = (transaction, student, course) => {
  const invoiceDate = formatDate(transaction.createdAt);
  const dueDate = formatDate(new Date().setDate(new Date().getDate() + 7));

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice - ${transaction.billNo}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 20px;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: #fff;
            border: 2px solid #003049;
            border-radius: 8px;
            padding: 30px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 2px solid #003049;
            padding-bottom: 20px;
        }
        .logo {
            text-align: left;
        }
        .logo h1 {
            color: #003049;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .logo p {
            color: #666;
            font-size: 14px;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-info h2 {
            color: #003049;
            font-size: 20px;
            margin-bottom: 10px;
        }
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
        }
        .section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #003049;
        }
        .section h3 {
            color: #003049;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .section p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: #003049;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
        }
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .total-section {
            text-align: right;
            margin-bottom: 30px;
        }
        .total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
        }
        .total-label {
            width: 150px;
            font-weight: 600;
            color: #003049;
        }
        .total-value {
            width: 120px;
            text-align: right;
            font-weight: 600;
        }
        .net-payable {
            font-size: 18px;
            color: #c1121f;
            border-top: 2px solid #003049;
            padding-top: 10px;
            margin-top: 10px;
        }
        .terms {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
        }
        .terms h4 {
            color: #003049;
            margin-bottom: 15px;
        }
        .terms ul {
            list-style: none;
            padding-left: 20px;
        }
        .terms li {
            margin-bottom: 8px;
            font-size: 12px;
            color: #666;
            position: relative;
        }
        .terms li:before {
            content: "•";
            color: #c1121f;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
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
            .invoice-container {
                border: none;
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo">
                <h1>CODE i TECHNOLOGY</h1>
                <p>123 Tech Street, Innovation City</p>
                <p>Phone: +91 9876543210 | Email: info@codeitech.com</p>
            </div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p><strong>Bill No:</strong> ${transaction.billNo}</p>
                <p><strong>Date:</strong> ${invoiceDate}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
            </div>
        </div>

        <div class="invoice-details">
            <div class="section">
                <h3>Student Information</h3>
                <p><strong>Name:</strong> ${student.fullName}</p>
                <p><strong>Roll No:</strong> ${student.rollNumber}</p>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Mobile:</strong> ${student.studentMobile}</p>
            </div>
            
            <div class="section">
                <h3>Billing Address</h3>
                <p>${formatAddress(student.permanentAddress)}</p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Fee/Month</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${course.title} (${course.duration} months)</td>
                    <td>${transaction.months} months</td>
                    <td>${formatCurrency(course.feePerMonth)}</td>
                    <td>${formatCurrency(transaction.amount)}</td>
                </tr>
                ${transaction.discount > 0 ? `
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Discount (10%)</strong></td>
                    <td>-${formatCurrency(transaction.discount)}</td>
                </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <div class="total-label">Subtotal:</div>
                <div class="total-value">${formatCurrency(transaction.amount)}</div>
            </div>
            ${transaction.discount > 0 ? `
            <div class="total-row">
                <div class="total-label">Discount:</div>
                <div class="total-value">-${formatCurrency(transaction.discount)}</div>
            </div>
            ` : ''}
            <div class="total-row net-payable">
                <div class="total-label">Net Payable:</div>
                <div class="total-value">${formatCurrency(transaction.netPayable)}</div>
            </div>
        </div>

        <div class="section">
            <h3>Payment Details</h3>
            <p><strong>Mode of Payment:</strong> ${transaction.modeOfPayment.toUpperCase()}</p>
            <p><strong>Status:</strong> ${transaction.status.toUpperCase()}</p>
            ${transaction.paymentProofUrl ? `
            <p><strong>Payment Proof:</strong> Provided</p>
            ` : ''}
        </div>

        <div class="terms">
            <h4>Terms & Conditions</h4>
            <ul>
                <li>Fee once paid is non-refundable and non-transferable</li>
                <li>Classes start next working day after demo class</li>
                <li>All fees must be paid in full before course commencement</li>
                <li>Certificate will be issued only after course completion and full payment</li>
                <li>Institute reserves the right to make changes to the schedule</li>
            </ul>
        </div>

        <div class="footer">
            <p>Thank you for choosing Code i Technology</p>
            <p>This is a computer-generated invoice. No signature is required.</p>
        </div>
    </div>
</body>
</html>
  `;
};

export const printInvoice = (transaction, student, course) => {
  const invoiceHTML = generateInvoiceHTML(transaction, student, course);
  const printWindow = window.open('', '_blank');
  
  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  
  printWindow.onload = function() {
    printWindow.print();
    printWindow.onafterprint = function() {
      printWindow.close();
    };
  };
};