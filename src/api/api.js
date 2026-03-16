import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 60000,
});

api.interceptors.response.use(
  res => res,
  error => {
    const msg = error.response?.data?.error || error.message || 'Request failed';
    toast.error(msg);

    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const login          = (email, password) => api.post('/api/auth/login', { email, password });
export const logout         = () => api.post('/api/auth/logout');
export const getMe          = () => api.get('/api/auth/me');

// ─── Company ─────────────────────────────────────────────
export const getCompanyProfile     = () => api.get('/api/company');
export const updateCompanyProfile  = (formData) => api.put('/api/company', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// ─── Proposals ───────────────────────────────────────────
export const createProposal     = data => api.post('/api/proposals/generate', data);
export const getAllProposals    = () => api.get('/api/proposals');
export const getProposalById    = id => api.get(`/api/proposals/${id}`);
export const deleteProposal = (id) => api.delete(`/api/proposals/${id}`);
export const updateProposal = (id, data) => api.put(`/api/proposals/${id}`, data);
export const updateProposalStatus = (id, status) => api.patch(`/api/proposals/${id}/status`, { status });

// ───  AI Editing & Regeneration ────

export const chatEdit = (id, data) =>
  api.post(`/api/proposals/${id}/chat`, data);


export const regenerateProposal = (id) =>
  api.post(`/api/proposals/${id}/regenerate`);

// ─── PDF Generation ───
export const generatePdf = (id) => api.post(`/api/proposals/${id}/pdf`);


export default api;