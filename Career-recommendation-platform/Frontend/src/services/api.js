/**
 * API Service for backend communication
 */
import axios from 'axios';

// Base URL for API - change this in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication APIs ====================

export const authAPI = {
  signup: async (userData) => {
    const response = await apiClient.post('/api/auth/signup', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/api/auth/profile', profileData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },
};

// ==================== Quiz APIs ====================

export const quizAPI = {
  generateQuiz: async (quizData) => {
    const response = await apiClient.post('/api/quiz/generate', quizData);
    return response.data;
  },

  submitQuiz: async (quizData) => {
    const response = await apiClient.post('/api/quiz/submit', quizData);
    return response.data;
  },
};

// ==================== Career APIs ====================

export const careerAPI = {
  predictCareer: async (userData) => {
    const response = await apiClient.post('/api/career/predict', userData);
    return response.data;
  },

  getCourseRecommendations: async (careerData) => {
    const response = await apiClient.post('/api/courses/recommend', careerData);
    return response.data;
  },

  generateRoadmap: async (roadmapData) => {
    const response = await apiClient.post('/api/roadmap/generate', roadmapData);
    return response.data;
  },

  chatbot: async (message) => {
    const response = await apiClient.post('/api/chatbot', { message });
    return response.data;
  },
};

// ==================== Resume APIs ====================

export const resumeAPI = {
  uploadResume: async (formData) => {
    const response = await apiClient.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  matchJob: async (jobMatchData) => {
    const response = await apiClient.post('/api/job/match', jobMatchData);
    return response.data;
  },

  analyzeSkillGap: async (gapData) => {
    const response = await apiClient.post('/api/skill-gap/analyze', gapData);
    return response.data;
  },

  generateInterviewQuestions: async (jdData) => {
    const response = await apiClient.post('/api/interview/questions', jdData);
    return response.data;
  },
};

// ==================== College APIs ====================

export const collegeAPI = {
  getAllColleges: async (params = {}) => {
    const response = await apiClient.get('/api/colleges/', { params });
    return response.data;
  },

  searchColleges: async (query) => {
    const response = await apiClient.get('/api/colleges/search', {
      params: { query },
    });
    return response.data;
  },

  getCollegeById: async (id) => {
    const response = await apiClient.get(`/api/colleges/${id}`);
    return response.data;
  },

  filterColleges: async (filters) => {
    const response = await apiClient.post('/api/colleges/filter', filters);
    return response.data;
  },

  recommendByCareer: async (params) => {
    const response = await apiClient.get('/api/colleges/recommend/by-career', {
      params,
    });
    return response.data;
  },

  getStates: async () => {
    const response = await apiClient.get('/api/colleges/states');
    return response.data;
  },

  getCollegeTypes: async () => {
    const response = await apiClient.get('/api/colleges/types');
    return response.data;
  },
};

// ==================== Profile APIs (Legacy) ====================

export const profileAPI = {
  updateProfile: async (profileData) => {
    const response = await apiClient.post('/api/profile/update', profileData);
    return response.data;
  },

  completeProfile: async (profileData) => {
    const response = await apiClient.post('/api/profile/complete', profileData);
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await apiClient.get(`/api/profile/${userId}`);
    return response.data;
  },
};

export default apiClient;
