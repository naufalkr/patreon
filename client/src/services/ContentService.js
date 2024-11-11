import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:8080/api';

class ContentService {
  createContent(formData, config = {}) {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/content`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token
      },
      ...config // This allows passing onUploadProgress
    });
  }
}

export default new ContentService();