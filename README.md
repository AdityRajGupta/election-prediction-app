🗳️ Election Prediction System

A modern MERN-stack platform designed to collect booth-level predictions and generate constituency-level insights for political teams.
Built with React + Vite, Node.js + Express, MongoDB Atlas, and deployed on Netlify + Render.

🚀 Live Project

Frontend:
🔗 https://election-prediction-front.netlify.app

Backend API:
🔗 https://election-prediction-backend.onrender.com/api

🎯 What This App Does

This application helps campaign teams gather real-time predictions from booth-level workers and automatically process the data into clear insights for constituency leaders (MLA/MP candidates).

It includes:

✔ Role-based dashboards

✔ Booth-level vote predictions

✔ Constituency analytics

✔ Party-wise vote share charts

✔ Leader dashboards with insights

✔ Full admin control panel


👥 User Roles

1. Admin Panel
   
Manage constituencies
Manage booths
Manage political parties
Create & manage users
Lock/unlock prediction submission
View system-wide analytics

2. Worker Dashboard

View assigned booths
Submit booth-level predictions
Update vote share + turnout %
Provide confidence level

3. Leader Dashboard

Constituency overview
Vote-share pie charts
Booth update progress
Predicted leading party
Trend insights

📦 Sample Accounts (Seed Data)

Admin

admin@example.com  
admin123

Workers

worker1@example.com / worker123  
worker2@example.com / worker123  
worker3@example.com / worker123  
worker4@example.com / worker123  

Leaders

leaderA@example.com / leader123  
leaderB@example.com / leader123  
leaderC@example.com / leader123  

🗂️ Sample Data Included
Constituencies

Lucknow
Kanpur
Varanasi

Booths

9 booths total (3 per constituency):
LK-001, LK-002, LK-003
KN-001, KN-002, KN-003
VR-001, VR-002, VR-003

Political Parties

Bharatiya Janata Party (BJP)
Indian National Congress (INC)
Aam Aadmi Party (AAP)
Samajwadi Party (SP)

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

React Router

Recharts

Backend

Node.js

Express.js

JWT Authentication

Mongoose

CORS

Database

MongoDB Atlas (Cloud)

Deployment

Netlify (Frontend)

Render (Backend)

🧰 Local Development Setup
Clone the project
git clone https://github.com/YourUsername/election-prediction-app.git

Backend
cd server
npm install
npm run dev


Add .env:

MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
PORT=5000

Frontend
cd client
npm install
npm run dev


Add .env:

VITE_API_BASE_URL=http://localhost:5000/api

🌐 Production Deployment Notes
Frontend (Netlify)

Base directory: client

Build command: npm run build

Publish directory: dist

Add _redirects in public/:

/* /index.html 200

Backend (Render)

Root directory: /server

Build: npm install

Start: npm start

Add environment variables:

MONGO_URI

JWT_SECRET

📊 Future Enhancements

Mobile App Version (React Native / PWA)

Real-time predictions (WebSockets)

Bulk CSV import (parties, booths, users)

Automated analytics summaries

Export dashboards as PDF/Excel

📄 License

MIT License — free to use and modify.
