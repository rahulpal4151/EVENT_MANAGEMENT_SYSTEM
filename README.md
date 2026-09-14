# 📅 Eventora - Event Management Web App

Eventora is a **full-stack event management application** built using the **MERN stack**. It is designed to streamline the process of event creation, admin approvals, and participant bookings.

This project was primarily developed to gain hands-on experience in **full-stack web development, REST API design, Role-Based Access Control (RBAC), and monolithic deployment**.

---

## 🌐 Live Demo & Repository

🚀 **Live Website:** `https://event-management-system-o6t2.onrender.com`

📦 **GitHub Repository:** `https://github.com/rahulpal4151/EVENT_MANAGEMENT_SYSTEM`

---

## 📌 About The Project

Managing events with multiple organizers and participants can get chaotic. **Eventora** was built as a practical solution to this problem where users can:

* Create an account and log in securely.
* Access role-specific dashboards based on their assigned permissions.
* Create and manage new events (Organizers).
* Approve or reject pending event requests (SuperAdmins).
* Browse approved events and apply for them (Participants).

The project utilizes robust backend logic split across dedicated controllers for admins, authentication, bookings, and events.

---

# ✨ Key Features


---
## 🔐 Role-Based Access Control (RBAC)

Eventora strictly enforces access control using a 3-tier RBAC system, modeled in the `User.models.js` schema.

```text
                 User
                  │
        ┌─────────┼─────────┐
        │         │         │
 SuperAdmin   Organizer  Participant
        │         │         │
        ▼         ▼         ▼
  Approve/   Create &     Browse &
Reject Events Manage Events Book Events
```


SuperAdmin: Has exclusive access to the Admin Dashboard to fetch Pending events and update their status using adminController.js.

Organizer: Can create new events and view a dedicated dashboard fetching only events created by their specific ID.

Participant: Can view all Approved events and make bookings, managed by the bookingController.js.

---
## 👤 User Authentication & Security

Secure user registration & login flow.

JWT-based authentication with HTTP-only cookies for session management.

Password hashing utilizing the bcryptjs package.

Protected frontend routes using React Context (AuthContext).

Secured backend API endpoints using custom verifyJWT middleware.
---
## 🛡️ Admin & Organizer Dashboards

Eventora provides dedicated administrative functionality for managing platform data.

---
### SuperAdmin capabilities include:

- Protected admin routes

- View all pending events on the platform

- Approve or Reject event requests

---
### Organizer capabilities include:


- Create new events

- View a dedicated dashboard of their own created events

---
## Technology

### Frontend

- React.js
- React Router DOM	
- Tailwind CSS	
- Framer Motion	
- Axios	
- Lucide React

### Backend & Dependencies

- Node.js & Express
- MongoDB & Mongoose
- `bcryptjs`
- `cookie-parser`
- `cloudinary`
- `cors`
- `body-parser`

---
## 🔌 REST API Structure
The backend exposes RESTful endpoints for authentication and event management.

---
### Authentication

- `POST /api/v1/auth/login` - Authenticates user and sets HTTP-only cookie.

- `POST /api/v1/auth/logout` - Clears authentication cookie.

---
### Events (Protected by JWT & Roles)

- `GET /api/v1/events/all-events` - Retrieves all Approved events (Public/Participants).
- `GET /api/v1/events/:id` - Fetches single event details.
- `POST /api/v1/events/create-events` - Creates a new event (Organizer only).
- `GET /api/v1/events/my-events` - Retrieves events created by the logged-in organizer.
- `GET /api/v1/events/pending-events` - Retrieves events with Pending status (SuperAdmin only).
- `PUT /api/v1/events/event-status/:eventId` - Updates event status to Approved or Rejected (SuperAdmin only).


---
# ⚙️ Installation & Setup

---
## 1. Clone the Repository
```git clone [https://github.com/rahulpal4151/EVENT_MANAGEMENT_SYSTEM.git]```

---
## 2. Install Dependencies
Install dependencies for both the frontend and backend:

```
# In the root directory (Backend)
npm install

# In the frontend directory
cd frontend
npm install
```

---
## 3. Environment Variables
```
frontend/.env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset


backend/.env
PORT = 5000
MONGO_URI=mongodb+srv://<db_user_name>:<password>@cluster0.r8iu7ke.mongodb.net/
ACCESS_TOKEN_SECRET=generate-your-long-acces-secrete-key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=generate-your-long-refresh-secrete-key
REFRESH_TOKEN_EXPIRY=10d
NODE_ENV=development
MAIL_USER=Your-Mail
MAIL_PASS=Your-Mail-Password
```

---
## 4. Run the Application


---
# 🚀 Deployment
- Eventora is deployed as a monolithic application on Render.
- The Node.js backend (index.js) is configured using express.static() to serve the React frontend's compiled dist folder.
- A catch-all route (*) ensures that React Router handles all frontend page navigation seamlessly on a single web service.

---
# 🧠 What I Learned
### While building this application, I strengthened my understanding of:

- ### *Backend Routing:* Structuring clean APIs using separate controllers for authentication, events, bookings, and admin actions.

- ### *Middleware & RBAC:* Securing routes with multi-tier role verification (authMiddleware.js).

- ### *Database Modeling:* Building relational data models for Users, Events, and Bookings using Mongoose.

- ### *Deployment:* Resolving CORS challenges, configuring static file serving in Node.js, and deploying a monolithic MERN application successfully.


---
# 🔒 Production Security Note
### VoteVerse is a portfolio/educational project and should not be considered suitable for conducting legally binding public elections without substantial additional security, auditing, identity verification, cryptographic vote-integrity mechanisms, privacy protections, and independent security review.

---
# 📜 License
### This project is developed for educational and portfolio purposes.

---
# ⭐ Support
### If you found VoteVerse interesting or useful, consider giving the repository a ⭐ on GitHub.

---

####                                         📅 Eventora
####                                  Secure • Role-Based • Event Management
####                                  Built with ❤️ by Rahul Pal | MERN Stack
