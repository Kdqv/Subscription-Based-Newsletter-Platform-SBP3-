# 📧 Backend Newsletter System

> A robust and secure newsletter management system designed to handle subscriptions and the distribution of exclusive content.

This project is a complete REST API for managing users, subscriptions (free/paid), and publications with granular permission control.

---

## ✨ Key fonctionnalities

- 🔐 **Secure Authentication** : Registration and login with JWT (JSON Web Tokens) and password hashing via `bcrypt`.
- 👥 **Roles management** : Distinction between administrators and subscribers.
- 💳 **Subscription system** : Automatic protection of "Premium" content for non-paying users.
- 📝 **Posts management (CRUD)** : Creating, reading, updating and deleting newsletters..
- 🗄️ **Relational Database** : Using PostgreSQL for maximum data integrity.

---

## 🛠️ Technical stack

- **Runtime** : [Node.js](https://nodejs.org/)
- **Framework** : [Express.js](https://expressjs.com/)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/)
- **Authentification** : [JWT](https://jwt.io/)
- **Client DB** : [pg (node-postgres)](https://node-postgres.com/)

---

## � Installation & Startup

### 1. Clone the repository
```bash
git clone https://github.com/Kdqv/Subscription-Based-Newsletter-Platform-SBP-.git
cd Subscription-Based-Newsletter-Platform-SBP-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environnement ⚙️
Create a file `.env` at the root, based on`.env.example` :
```env
PORT=3000
DB_USER=votre_user
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
DB_NAME=newsletter_db
JWT_SECRET=un_secret_tres_robuste
```

### 4. Initialise the database 💾
Ensure that PostgreSQL is installed, then run the script to create the tables automatically. :
```bash
psql -U your_user -d newsletter_db -f database/schema.sql
```

### 5. Launch the application 🏃
```bash
# Development mode (with auto-reload if configured)
npm run dev
```

---

## 🧪 Tests of API

The project includes a ready-to-use test file.
- 📂 File : `src/requests/newslatter.rest`
- 💡 Use : Install extension **REST Client** in VS Code to execute requests directly in the editor.

---

## 📁 Project Architecture

```text
|
├── src/
│   ├── config/         # Configuration (DB, etc.)
│   ├── controllers/    # Input processing logic
│   ├── middlewares/    # Authentication & Error Handling
│   ├── routes/         # Defining API entry points
│   ├── services/       # Business Logic & Database Queries
│   ├── utils/          # Utility functions (Tokens, etc.)
│   └── server.js       # Application entry point
└── README.md           # Documentation
```
