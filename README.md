# ⚙️ Zerodha Clone - Backend API

The backend REST API server for the Zerodha-inspired trading platform. It handles authentication, holdings, positions, orders and watchlist data for the trading dashboard, and is deployed in **two ways**: on **Render** (third-party hosting, used by the Vercel frontends) and on a manually configured **AWS EC2** server, where it listens on **port 8000**.

## 🌐 Deployments

This project uses **two backend deployments**:

| | Deployment 1 — Render | Deployment 2 — AWS EC2 |
|---|---|---|
| **Type** | Third-party managed hosting | Manually set up cloud server |
| **Used by** | Vercel-hosted landing page & dashboard | Hands-on cloud / DevOps deployment |
| **Base URL** | `https://zerodha-clone-server-r4uq.onrender.com` | `http://ec2-13-60-236-98.eu-north-1.compute.amazonaws.com:80` |
| **Protocol** | HTTPS (provided by Render) | HTTP (no TLS certificate yet) |
| **Deploys via** | Render | GitHub Actions → EC2 |

## ✨ Features

### Authentication

* Secure login and registration
* JWT-based authentication
* Cookie-based session management

### Portfolio & Trading

* Manage user holdings
* Track positions and orders
* Buy stock workflow with portfolio updates
* Persistent watchlist data

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* HTTP Cookies
* AWS EC2
* GitHub Actions (CI/CD)
* Linux

## 🗄️ Database Collections

* Users
* Holdings
* Positions
* Orders

## 🧩 Deployment 1: Render (third-party hosting)

The backend is hosted on **Render**, a third-party platform. This deployment serves the frontends hosted on **Vercel** (landing page and dashboard). Render provides HTTPS by default, so the Vercel apps (which are served over HTTPS) can call the API securely.

## ☁️ Deployment 2: AWS EC2 (manual cloud server setup)

The same backend is also deployed on an **Amazon EC2 instance** that I set up and configured manually, to practice real cloud/server workflows instead of relying on a managed platform. The server listens on **port 80**, and it is reached through the **EC2 public DNS**, which is exposed so the dashboard and other clients can access the API externally:

```text
http://ec2-13-60-236-98.eu-north-1.compute.amazonaws.com:80
```

```text
Client → EC2 Public DNS : 80 → Node.js / Express Server → MongoDB
```

* The server is configured to listen on port `80`.
* Port `80` is opened for inbound traffic in the EC2 **security group**, otherwise the API cannot be reached from outside the instance.
* The application process is managed on the Linux server.
* Pushing changes to the `main` branch triggers a **GitHub Actions** workflow that automatically deploys the update to the EC2 instance.

```text
GitHub → GitHub Actions → AWS EC2 → Live API
```

### 🔓 Why HTTP and not HTTPS?

The API is currently served over **HTTP**, not HTTPS. This is because I **do not currently have a TLS/SSL certificate** configured for the deployment. Until HTTPS is set up, traffic between the client and the server is not encrypted, so sensitive data (such as passwords) should not be sent to the EC2 endpoint in a production setting.

HTTPS is a planned improvement. It requires a domain name and a TLS certificate (for example from Let's Encrypt), typically terminated by a reverse proxy such as NGINX in front of the Node.js server.

## 🏗️ Architecture

The project is divided into three independent modules:

1. Landing Page Application
2. Trading Dashboard Application
3. Backend API Server *(this repository)*

This separation allows independent development and deployment of the frontend and backend services.

## 🔗 Related Repositories

* Landing Page: https://github.com/OptiSolvD/zerodha-clone-landing-
* Dashboard: https://github.com/OptiSolvD/zerodha-clone-dashboard-
* Dashboard Live Demo: https://zerodha-clone-dashboard-gilt.vercel.app/

## ⚙️ Installation

```bash
git clone https://github.com/OptiSolvD/zerodha-clone-backend-.git
cd zerodha-clone-backend-
npm install
```

Create a `.env` file (variable names are examples; match them to your code):

```env
PORT=8000
MONGO_URL=<your-mongodb-connection-string>
JWT_SECRET=<your-secret>
```

Run the server:

```bash
npm start
```

The API will be available locally at `http://localhost:8000`.

## 🚀 Future Enhancements

* Configure HTTPS with a TLS certificate
* Sell order functionality
* Real-time stock market integration
* Advanced portfolio analytics
* Performance tracking

## 👤 Author

**Raj Kaushik**
