import api from './api';

export const verifyCertificateAPI = {
  getCertificateInfo: (certNumber) => {
    const encodedCertNumber = encodeURIComponent(certNumber);
    return api.get(`/verifyCertificate/${encodedCertNumber}`);
  }
};