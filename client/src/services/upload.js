import api from './api';
import toast from 'react-hot-toast';

export const uploadService = {
  /**
   * Uploads a file to the server.
   * @param {File} file - The file to upload.
   * @param {string} folder - The destination folder on the server (e.g., 'student-photos', 'payment-proofs').
   * @param {function} onUploadProgress - Optional callback for upload progress.
   * @returns {Promise<string|null>} The URL of the uploaded file or null on failure.
   */
  uploadFile: async (file, folder = 'uploads', onUploadProgress) => {
    if (!file) {
      toast.error('No file selected for upload.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      toast.success('File uploaded successfully!');
      return response.data.url; // Assuming the server returns { url: '...' }
    } catch (error) {
      toast.error(error.response?.data?.error || 'File upload failed.');
      return null;
    }
  },
};
