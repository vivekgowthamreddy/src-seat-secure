# Deployment Guide

This guide describes how to deploy the frontend to Vercel and the backend to Render.

## 1. Backend Deployment (Render)

Render is a cloud platform that can host Node.js applications.

### Steps:
1.  **Push your code to GitHub.** Ensure your project is in a GitHub repository.
2.  **Create a Web Service on Render:**
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure the Service:**
    *   **Name:** `seat-secure-backend` (or similar)
    *   **Root Directory:** `backend` (Important! This tells Render the app is in the subfolder)
    *   **Environment:** `Node`
    *   **Build Command:** `npm install && npm run build`
    *   **Start Command:** `npm run start:prod`
4.  **Environment Variables:**
    *   Add the following environment variables in the Render dashboard (Environment tab):
        *   `MONGO_URI`: Your MongoDB connection string.
        *   `JWT_SECRET`: A secure random string for JWT signing.
        *   `EMAIL_USER`: Your email for sending OTPs (if used).
        *   `EMAIL_PASS`: Your email password (if used).
        *   `PORT`: `10000` (Render usually sets this automatically, but you can set it if needed. The app listens on `process.env.PORT`).
5.  **Deploy:** Click **Create Web Service**. Wait for the specific deployment URL (e.g., `https://seat-secure-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

Vercel is optimized for frontend frameworks like Vite.

### Steps:
1.  **Create a New Project on Vercel:**
    *   Go to [vercel.com](https://vercel.com).
    *   Click **Add New...** -> **Project**.
    *   Import your GitHub repository.
2.  **Configure the Project:**
    *   **Framework Preset:** `Vite` (should be auto-detected)
    *   **Root Directory:** `./` (default)
    *   **Build Command:** `npm run build` (default)
    *   **Output Directory:** `dist` (default)
    *   **Install Command:** `npm install` (default)
3.  **Environment Variables:**
    *   Add the following environment variable:
        *   `VITE_API_BASE_URL`: The URL of your deployed backend (from Step 1), e.g., `https://seat-secure-backend.onrender.com`.
4.  **Deploy:** Click **Deploy**.

## Troubleshooting
- **CORS Issues:** If usages fail from the frontend, ensure your backend allows the Vercel domain. Currently, the backend allows all origins (`app.enableCors()`), so it should work out of the box.
- **Database Connection:** Ensure your MongoDB Atlas (or other provider) allows connections from anywhere (`0.0.0.0/0`) or specifically from Render IPs.
