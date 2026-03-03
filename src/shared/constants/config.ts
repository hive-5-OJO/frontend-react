export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
export const GOOGLE_REDIRECT_URI = `${window.location.origin}/oauth/google/callback`;
