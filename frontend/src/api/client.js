import axios from "axios";

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./authStorage";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${API_URL}/api/auth/refresh/`, { refresh })
        .then((res) => {
          setTokens({ access: res.data.access, refresh });
          return res.data.access;
        })
        .catch((refreshError) => {
          clearTokens();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const newAccess = await refreshPromise;
      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${newAccess}`;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;

export function register(data) {
  return api.post("/auth/register/", data);
}

export function login(data) {
  return api.post("/auth/login/", data).then((res) => {
    setTokens({ access: res.data.access, refresh: res.data.refresh });
    return res.data;
  });
}

export function logout() {
  clearTokens();
}

export function fetchMovies() {
  return api.get("/movies/");
}

export function fetchMovie(id) {
  return api.get(`/movies/${id}/`);
}

export function fetchShowtimeSeats(showtimeId) {
  return api.get(`/showtimes/${showtimeId}/seats/`);
}

export function createBooking(payload) {
  return api.post("/bookings/", payload);
}

export function fetchMyBookings() {
  return api.get("/bookings/me/");
}
