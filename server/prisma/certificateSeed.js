const certificateData = {
  // Data from CERTIFICATE.xlsx - coding.csv
  coding: [
    { certificateNo: '2024CIT100C010', studentName: 'ISHU KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C011', studentName: 'ANSHUMAN KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C012', studentName: 'ASHISH KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C013', studentName: 'ANKU KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C014', studentName: 'VIKASH KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C015', studentName: 'RAVI KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C016', studentName: 'SHIVANK KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C017', studentName: 'TARKESHWAR KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C018', studentName: 'RAHUL KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C019', studentName: 'VIVEK KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C020', studentName: 'RITU RAJ LAHERI', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C021', studentName: 'VIKASH KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C022', studentName: 'PAWAN KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C023', studentName: 'ANKIT KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C024', studentName: 'SACHIN KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C025', studentName: 'RAHUL KUMAR', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2023-12-11', endDate: '2024-06-11', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
    { certificateNo: '2024CIT100C026', studentName: 'RITIK RAJ', courseName: 'C PROGRAMMING LANGUAGE', startDate: '2025-05-19', endDate: '2025-07-01', teacherName: 'Mr Nishant', issueDate: '2024-07-07' },
  ],
  // Data from CERTIFICATE.xlsx - DBMS.csv
  dbms: [
    { certificateNo: '2022CIT20092210', studentName: 'ABHIJEET KUMAR SINGH', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
    { certificateNo: '2022CIT20092211', studentName: 'ASHISH KUMAR', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
    { certificateNo: '2022CIT20092212', studentName: 'SUBHAM KUMAR SINGH', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
    { certificateNo: '2022CIT20092213', studentName: 'ANSHUMAN KUMAR', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-08-01' },
    { certificateNo: '2022CIT20092214', studentName: 'ISHU KUMAR', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
    { certificateNo: '2022CIT20092215', studentName: 'VIVEK KUMAR', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
    { certificateNo: '2022CIT20092216', studentName: 'SONALI SINHA', courseName: 'ORACLE DATABASE', startDate: '2022-09-20', endDate: '2023-03-20', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
    { certificateNo: '2022CIT20092217', studentName: 'HARSHIT ADITYA', courseName: 'ORACLE DATABASE', startDate: '2023-06-01', endDate: '2023-07-31', teacherName: 'Mr Nishant', issueDate: '2023-03-25' },
  ],
  // Data from CERTIFICATE.xlsx - DCA.csv
  dca: [
    { certificateNo: '2022CIT01082201', studentName: 'VISHAL KUMAR', courseName: 'DCA', startDate: '2022-02-01', endDate: '2022-07-31', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2022-08-01' },
    { certificateNo: '2022CIT01092202', studentName: 'HRITIK KUMAR', courseName: 'DCA', startDate: '2022-09-01', endDate: '2023-03-01', teacherName: 'Mr PRAVEEN KUMAR', issueDate: '2023-04-02' },
  ],
  // Data from CERTIFICATE.xlsx - ADCA.csv
  adca: [
    { certificateNo: 'CIT/BR/2022/JULY/1010', studentName: 'MRITUNJAY KUMAR', courseName: 'ADCA', startDate: '2022-06-01', endDate: '2023-05-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-06-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1011', studentName: 'JAI PRAKASH ROY', courseName: 'ADCA', startDate: '2022-06-01', endDate: '2023-05-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-06-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1012', studentName: 'RAMMOHAN CHOUDHARY', courseName: 'ADCA', startDate: '2022-06-01', endDate: '2023-05-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-06-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1013', studentName: 'ROHIT KUMAR', courseName: 'ADCA', startDate: '2022-06-01', endDate: '2023-05-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-06-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1014', studentName: 'PALLAVI PUSHPA', courseName: 'ADCA', startDate: '2022-07-01', endDate: '2023-06-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-06-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1015', studentName: 'SIMA KUMARI', courseName: 'ADCA', startDate: '2022-07-01', endDate: '2023-06-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-07-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1016', studentName: 'SUMANT KUMAR MEHTA', courseName: 'ADCA', startDate: '2022-07-01', endDate: '2023-05-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-07-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1017', studentName: 'ABHIJEET KUMAR SINGH', courseName: 'ADCA', startDate: '2022-07-01', endDate: '2023-06-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-07-01' },
    { certificateNo: 'CIT/BR/2022/JULY/1018', studentName: 'SAURABH RAJ', courseName: 'ADCA', startDate: '2022-07-01', endDate: '2023-06-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-07-01' },
  ],
  // Data from CERTIFICATE.xlsx - TYPING.csv
  typing: [
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0011', studentName: 'MRITUNJAY KUMAR', courseName: 'TYPING', hindi: '', english: '40', startDate: '2022-06-01', endDate: '2022-11-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2022-12-01' },
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0012', studentName: 'PALLAVI PUSHPA', courseName: 'TYPING', hindi: '', english: '40', startDate: '2020-04-02', endDate: '2023-09-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-10-01' },
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0013', studentName: 'SIMA KUMARI', courseName: 'TYPING', hindi: '', english: '40', startDate: '2020-04-02', endDate: '2023-09-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-10-01' },
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0014', studentName: 'SHASHI ANJANA', courseName: 'TYPING', hindi: '', english: '40', startDate: '2022-06-01', endDate: '2022-11-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2022-12-01' },
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0015', studentName: 'DEEPAK KUMAR', courseName: 'TYPING', hindi: '35', english: '40', startDate: '2020-04-02', endDate: '2023-09-30', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2023-10-01' },
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0016', studentName: 'ABHIJEET KUMAR SINGH', courseName: 'TYPING', hindi: '35', english: '40', startDate: '2023-07-01', endDate: '2023-12-31', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2024-01-02' },
    { certificateNo: 'CIT/BR/2022/JULY/TYPE/0017', studentName: 'ASHUTOSH KUMAR', courseName: 'TYPING', hindi: '35', english: '40', startDate: '2023-07-01', endDate: '2023-12-31', teacherName: 'MR PRAVEEN KUMAR', issueDate: '2024-01-02' },
  ]
};

/**
 * Seeds the database with certificate data.
 * @param {PrismaClient} prisma The Prisma client instance.
 */
async function seedCertificates(prisma) {
  console.log('Seeding certificates...');

  const allCertificates = [];

  const processCertificate = (cert, courseType) => {
    // Basic validation to skip empty rows
    if (!cert.certificateNo || !cert.studentName) {
      return null;
    }
    return {
      certificateNumber: cert.certificateNo.trim(),
      studentName: cert.studentName.trim(),
      courseName: cert.courseName.trim(),
      issueDate: new Date(cert.issueDate),
      startDate: new Date(cert.startDate),
      endDate: new Date(cert.endDate),
      instructorName: cert.teacherName.trim(),
      courseType,
    };
  };

  // Process coding and DBMS courses (courseType: 1)
  certificateData.coding.forEach(cert => allCertificates.push(processCertificate(cert, 1)));
  certificateData.dbms.forEach(cert => allCertificates.push(processCertificate(cert, 1)));

  // Process DCA and ADCA courses (courseType: 2)
  certificateData.dca.forEach(cert => allCertificates.push(processCertificate(cert, 2)));
  certificateData.adca.forEach(cert => allCertificates.push(processCertificate(cert, 2)));

  // Process typing courses (courseType: 3)
  certificateData.typing.forEach(cert => {
    const hindiSpeed = cert.hindi ? `Hindi: ${cert.hindi} WPM` : '';
    const englishSpeed = cert.english ? `English: ${cert.english} WPM` : '';
    const grade = [hindiSpeed, englishSpeed].filter(Boolean).join(', ');
    allCertificates.push(processCertificate(cert, 3));
  });

  const validCertificates = allCertificates.filter(Boolean);

  if (validCertificates.length > 0) {
    await prisma.certificate.createMany({
      data: validCertificates,
      skipDuplicates: true, // This will prevent errors if you run the seed script multiple times
    });
    console.log(`Seeded ${validCertificates.length} certificates.`);
  } else {
    console.log('No new certificates to seed.');
  }
}

module.exports = seedCertificates;
