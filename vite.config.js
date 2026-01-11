import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        dashboard: "main.html",
        verifiedAccount: "verified-account.html",
        adminDashboard: "admin.html",
        forgotPassword: "reset-password.html",
      },
    },
  },
});
