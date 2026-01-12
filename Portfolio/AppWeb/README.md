# AppWeb

A **Task Manager / Simple CRM web application** built with **React** on the frontend and **Django Rest Framework (DRF)** on the backend.

The application allows managing **users, roles, projects and tasks**, with authentication, role-based permissions, protected APIs and a responsive, modern UI.

---

######## Live Demo ########

- **Frontend:** (add your deployed frontend URL)
- **Backend API:** (add your deployed backend URL)

> Demo Admin User  
> Email: admin@example.com  
> Password: admin123

---

######## Features ########

######## 👤 Authentication & Users ########

- User registration and login
- JWT authentication
- Role-based access control
- User roles:
  - **Admin**
  - **Manager**
  - **User**
- Protected frontend routes and backend API

---

######## Projects ########

- Create, list and delete projects
- Animated project creation (`animate.css`)
- Confirmation modal before deleting projects
- Admin-only project deletion

---

######## Tasks ########

- Create, delete tasks and edit tasks's title
- Task status management
- Animated task creation
- Reusable confirmation modal for deletion

---

######## Admin Panel ########

- Admin-only dashboard
- User management
- Role assignment using Django Groups
- Prevents admins from removing their own admin role
- Role badges with colors

---

######## UI / UX ########

- Fully responsive (mobile, tablet, desktop)
- Bootstrap 5 layout system
- React-Bootstrap modals
- Animate.css animations
- No browser alerts (custom modals)
- Clean and modern UI

---

######## Tech Stack ########

######## Frontend ########

- React
- React Router
- Bootstrap 5
- React-Bootstrap
- Animate.css
- JWT authentication

######## Backend ########

- Python
- Django
- Django Rest Framework
- Django Authentication & Groups
- JWT (SimpleJWT)

######## Database ########

- SQLite (development)
- PostgreSQL (production)

---

######## Local Installation ########

######## 1. Clone the repository ########

'''bash
git clone https://github.com/your-username/task-manager-crm.git
cd AppWeb

######## 2. Backend setup (Django) ########

'''bash

cd app_web_backend
python -m .venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

backend will run at: http://localhost:8000

######## 3. Frontend setup (React) ########

'''bash

cd app_web_frontend
npm install
npm run dev

frontend will run at: http://localhost:5173

---

######## Environment Variables ########

######## Backend (.env) ########

SECRET_KEY=your_secret_key
DEBUG=True

######## Frontend (.env) ########

VITE_API_URL=http://localhost:8000/api

---

######## Project Structure ########

AppWeb/
|-- app_web_backend/
| |-- app_web/
| |-- projects/
| |-- tasks/
| |-- users/
| |-- db.sqlite3
| |-- manage.py
| |-- requirements.txt
|  
|-- app_web_frontend/
| |-- src/
| | |-- api/
| | |-- assets/
| | |-- components/
| | |-- constants/
| | |-- context/
| | |-- pages/
| |-- package.json
| |-- vite.config.js
|
|-- README.md

---

######## Security & Permissions ########

- JWT-protected API endpoints
- Role-based permissions using Django Groups
- Admin-only endpoints protected on backend
- Frontend route protection
- Safe deletion using confirmation modals

---

######## Deployment ########

- Frontend: Vercel/Netlify
- Backend: Render/Railway/Fly.io
- Database: PostgreSQL

---

######## Future Improvements ########

- Task assignment to users
- Task comments
- Notifications
- Activity logs
- Unit and integration tests

---

######## Author ########

Jean Michael Tafur Leal
💻 Full Stack Developer
🔗 LinkedIn: https://linkedin.com/in/your-profile
🐙 GitHub: https://github.com/your-username
