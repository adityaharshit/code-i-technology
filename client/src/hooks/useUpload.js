import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';


const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file, folder = 'uploads') => {
    if (!file) return null;

    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const response = await api.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      toast.success("File Uploaded Successfully!");
      return response.data.url;
    } catch (error) {
        toast.error(error.response?.data?.error || "File could not be uploaded.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadProgress, uploadFile };
};

export default useUpload;