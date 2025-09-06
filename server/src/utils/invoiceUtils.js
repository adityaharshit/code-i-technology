// server/src/utils/invoiceUtils.js
const generateInvoiceHTML = (transaction, student, course) => {
  const receiptDate = new Date(transaction.createdAt).toLocaleDateString('en-IN');
  
  const studentAddress = student.localAddress && typeof student.localAddress === 'object'
    ? `${student.localAddress.flatHouseNo || ''}, ${student.localAddress.street || ''}, ${student.localAddress.po || ''}, ${student.localAddress.ps || ''}, ${student.localAddress.district || ''}, ${student.localAddress.state || ''} - ${student.localAddress.pinCode || ''}`
    : 'Address not available';

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  // Simple check for UPI based on mode of payment. You might want a more robust check.
  const isUpi = transaction.modeOfPayment.toLowerCase().includes('upi') || transaction.modeOfPayment.toLowerCase().includes('online');
  const isCash = transaction.modeOfPayment.toLowerCase().includes('cash') || transaction.modeOfPayment.toLowerCase().includes('offline');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt - ${transaction.billNo}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        body {
          font-family: 'Roboto', Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
          color: #333;
        }
        .receipt-container {
          max-width: 800px;
          margin: 20px auto;
          background-color: #fff;
          border: 2px solid #000;
          padding: 25px;
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #000;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }
        .company-details {
          flex: 1;
        }
        .company-details img {
          max-width: 180px;
          margin-bottom: 10px;
        }
        .company-details p {
          margin: 2px 0;
          font-size: 14px;
        }
        .receipt-title-section {
          text-align: right;
        }
        .receipt-title {
          font-size: 48px;
          font-weight: 700;
          margin: 0;
          letter-spacing: 2px;
        }
        .receipt-info {
          font-size: 14px;
          margin-top: 10px;
        }
        .receipt-info table {
          width: 100%;
          border-collapse: collapse;
        }
        .receipt-info td {
          padding: 2px 0;
        }
        .student-details {
          border: 1px solid #000;
          padding: 10px;
          margin-bottom: 20px;
        }
        .student-details table {
          width: 100%;
          font-size: 15px;
        }
        .student-details td {
          padding: 3px 5px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }
        .items-table th, .items-table td {
          border: 1px solid #000;
          padding: 10px;
          text-align: center;
          font-size: 14px;
        }
        .items-table th {
          background-color: #f2f2f2;
          font-weight: 500;
        }
        .items-table .course-name {
          text-align: left;
        }
        .payment-summary {
          display: flex;
          justify-content: space-between;
        }
        .payment-mode, .payment-totals {
          width: 49.5%;
        }
        .payment-mode {
          border: 1px solid #000;
          border-top: none;
          padding: 10px;
          font-size: 14px;
        }
        .payment-mode-options {
          margin-top: 10px;
        }
        .payment-totals table {
          width: 100%;
          border-collapse: collapse;
        }
        .payment-totals td {
          border: 1px solid #000;
          padding: 10px;
          font-size: 14px;
        }
        .payment-totals td:first-child {
          font-weight: 500;
          width: 40%;
        }
        .footer {
          margin-top: 30px;
        }
        .terms {
          border: 1px solid #000;
          padding: 5px 10px;
          margin-bottom: 30px;
        }
        .terms p {
          font-weight: bold;
          font-size: 12px;
          margin: 0;
        }
        .terms ul {
          margin: 5px 0 5px 20px;
          padding: 0;
          list-style-type: square;
          font-size: 12px;
        }
        .signature {
          text-align: right;
          margin-bottom: 20px;
          border-top: 1px solid #000;
          padding-top: 5px;
          font-weight: 500;
        }
        .thank-you {
          text-align: center;
          font-weight: 500;
        }
        .print-button {
            display: block;
            width: 150px;
            margin: 30px auto 10px;
            padding: 10px;
            background-color: #003049;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
        }
        @media print {
          body { padding: 0; background-color: #fff; }
          .receipt-container { margin: 0; border: none; }
          .print-button { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <div class="company-details">
            <img src="https://placehold.co/400x100/000000/FFFFFF?text=CODE+i+TECHNOLOGY" alt="CODE i TECHNOLOGY Logo">
            <p><strong>Aman & Akash Complex, Sinha College More</strong></p>
            <p>Aurangabad Bihar - 824101</p>
            <p><strong>Mobile Number:</strong> +91 7004554075</p>
            <p><strong>Email:</strong> infocodeitechnology@gmail.com</p>
          </div>
          <div class="receipt-title-section">
            <h1 class="receipt-title">RECEIPT</h1>
            <div class="receipt-info">
              <table>
                <tr>
                  <td>Receipt Number</td>
                  <td>/ ${transaction.billNo}</td>
                </tr>
                <tr>
                  <td>Receipt Date</td>
                  <td>/ ${receiptDate}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <div class="student-details">
          <table>
            <tr>
              <td style="width: 200px;"><strong>Student ID / Enrollment No.:</strong></td>
              <td>${student.rollNumber}</td>
            </tr>
            <tr>
              <td><strong>Name:</strong></td>
              <td>${student.fullName}</td>
            </tr>
            <tr>
              <td><strong>Mobile Number:</strong></td>
              <td>${student.studentMobile}</td>
            </tr>
            <tr>
              <td><strong>Address:</strong></td>
              <td>${studentAddress}</td>
            </tr>
          </table>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th class="course-name">Course Name.</th>
              <th>Course Fee</th>
              <th>Discount</th>
              <th>Net Amount Payable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td class="course-name">${course.title}</td>
              <td>${formatCurrency(transaction.amount)}</td>
              <td>${formatCurrency(transaction.discount)}</td>
              <td>${formatCurrency(transaction.netPayable)}</td>
            </tr>
            <!-- Empty rows for spacing -->
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>
            <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>
        
        <div class="payment-summary">
          <div class="payment-mode">
            <strong>Mode of Payment</strong>
            <div class="payment-mode-options">
              <input type="checkbox" id="cash" ${isCash ? 'checked' : ''} disabled>
              <label for="cash">Cash</label>
              <br>
              <input type="checkbox" id="upi" ${isUpi ? 'checked' : ''} disabled>
              <label for="upi">UPI</label>
              ${isUpi ? `<div style="border: 1px solid #000; padding: 5px; margin-top: 5px; display: inline-block;">Transaction Ref: Proof Attached</div>` : ''}
            </div>
          </div>
          <div class="payment-totals">
            <table>
              <tr>
                <td>Amount Paid</td>
                <td>${formatCurrency(transaction.netPayable)}</td>
              </tr>
              <tr>
                <td>Balance Due</td>
                <td>${formatCurrency(0)}</td>
              </tr>
              <tr>
                <td>Remark</td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="footer">
          <div class="terms">
            <p>TERMS & CONDITION</p>
            <ul>
              <li>Fee once paid is non-refundable and non-transferable.</li>
              <li>Classes commence from the next working day after demo class completion.</li>
            </ul>
          </div>
          <div class="signature">
            Seal & Signature
          </div>
          <div class="thank-you">
            Thank you for the payment!
          </div>
        </div>
      </div>
      <button class="print-button" onclick="window.print()">Print Receipt</button>
    </body>
    </html>
  `;
};

module.exports = {
  generateInvoiceHTML
};

