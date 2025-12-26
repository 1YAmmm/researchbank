// Shared configuration for frontend
const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/auth"
    : "https://researchbank-eta.vercel.app/api/auth";
