# Subscription-Based Newsletter Platform

A **subscription-based newsletter platform** that allows users to register, authenticate, and access premium content through a paid subscription model. Payments are simulated using **Stripe**.

---

## 🚀 Features

* User authentication (register / login)
* Subscription management
* Access to premium, subscriber-only content
* **Stripe** integration for payment simulation
* Clear separation between Frontend and Backend

---

## 🛠️ Tech Stack

### Frontend

* **React.js**
* Axios for HTTP requests
* Context API for global state management

### Backend

* **Node.js**
* **Express.js**
* JWT for authentication
* Stripe API for payment handling

---

## 📁 Project Structure

```
root/
│
├── frontend/   # React frontend
├── backend/    # Node.js + Express backend
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the **backend** directory with the following variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## ▶️ Running the Project Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 💳 Stripe Integration

Stripe is used to simulate subscription payments. No real transactions are performed. Make sure to use **Stripe test keys** when running the project.

---

## 🚀 Deployment

* Frontend deployed using **Render**
* Backend deployed using **Render**

Make sure CORS and environment variables are properly configured for production.

---

## 📌 Future Improvements

* Role-based access (admin / creator)
* Newsletter editor
* Email delivery integration
* Subscription plans & billing history

---

## 📄 License

This project is for educational purposes only.

