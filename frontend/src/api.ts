import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL,
  headers: {
    
    ...(process.env.REACT_APP_API_KEY ? { "x-api-key": process.env.REACT_APP_API_KEY } : {}),
  },
});


api.interceptors.request.use((req) => {
  try {
    
    const fullUrl = req.baseURL ? `${req.baseURL.replace(/\/$/, '')}/${req.url?.replace(/^\//, '')}` : req.url;
    
    console.debug('[api] request', req.method, fullUrl, req.params || '');
  } catch (e) {
    // ignore logging errors
  }
  return req;
});

api.interceptors.response.use(
  (res) => {
    console.debug('[api] response', res.status, res.config.url);
    return res;
  },
  (err) => {
    // axios error: include status and response data if available
    console.error('[api] error', err?.response?.status, err?.config?.url, err?.response?.data || err.message);
    return Promise.reject(err);
  },
);

export default api;
