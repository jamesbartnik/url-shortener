# 🔗 URL Shortener

A simple and modern URL shortening service with:

- ⚡ Vite + React frontend  
- 🚀 Node.js + TypeScript backend (Express)  
- 🐳 Dockerized development and deployment  
- ☁️ Hosted on AWS using Elastic Beanstalk  
- 🧠 Optionally powered by DynamoDB in production  

---

## 🖼 Features

- Input any long URL and get a shortened version instantly  
- Copy-to-clipboard one-click support  
- Frontend and backend are both containerized  
- Environment-aware storage:  
  - 🧪 In-memory storage in dev  
  - 🔐 DynamoDB in production  

---

## 🛠 Tech Stack

| Layer     | Tech                             |
|-----------|----------------------------------|
| Frontend  | Vite + React + Tailwind CSS      |
| Backend   | Node.js + Express + TypeScript   |
| Storage   | DynamoDB (prod) / In-memory (dev)|
| Deploy    | Docker + AWS Elastic Beanstalk   |
| Infra     | AWS CLI + Terraform              |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# Install frontend & backend deps separately
cd frontend && yarn install
cd ../backend && yarn install
```

---

### 2. Local Development

#### Backend

```bash
cd backend
yarn dev
```

> Runs backend at http://localhost:3001

#### Frontend

```bash
cd frontend
yarn dev
```

> Runs frontend at http://localhost:3000

Make sure the `VITE_API_URL` in `.env` or `vite.config.ts` points to `http://localhost:3001`.

---

### 3. Docker Compose (Full Stack)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:3001

---

## ☁️ Deploying to AWS

### Prerequisites

- AWS CLI configured (`aws configure`)
- ECR repositories created
- Elastic Beanstalk environments up and running
- An S3 bucket (e.g. `elasticbeanstalk-us-west-2-<account-id>`)
- Docker installed

---

### One-command Deploy (Backend & Frontend)

```powershell
.\deploy.ps1
```

Or, skip rebuilding images:

```powershell
.\deploy.ps1 -SkipDockerBuild
```

This will:

- Build & push Docker images to ECR  
- Generate `Dockerrun.aws.json` files  
- Upload zip artifacts to S3  
- Create new Elastic Beanstalk versions  
- Update environments to pull the new version  

---

## 📁 Project Structure

```
url-shortener/
├── backend/                # Express + TypeScript API
│   └── src/
├── frontend/               # Vite + React UI
│   └── src/
├── deploy.ps1              # AWS CLI deploy script
├── Dockerrun-*.json        # EB deployment configs
├── docker-compose.yml
├── Terraform/              # (Optional) Infra-as-code setup
```

---

## 🔐 Environment Variables

### Backend

| Variable         | Description                        |
|------------------|------------------------------------|
| `NODE_ENV`       | `development` or `production`      |
| `PORT`           | Default: `3001`                    |
| `DYNAMODB_TABLE` | Table name for production          |
| `AWS_REGION`     | AWS region (e.g. `us-west-2`)      |

### Frontend

| Variable         | Description                         |
|------------------|-------------------------------------|
| `VITE_API_URL`   | Backend endpoint (e.g. `http://localhost:3001`) |

---

## 📄 License

MIT © [Your Name](https://github.com/your-username)