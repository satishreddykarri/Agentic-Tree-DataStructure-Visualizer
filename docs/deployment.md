# AWS EC2 Deployment Guide — Agentic Tree

## Prerequisites

- AWS account
- EC2 instance: Ubuntu 22.04 LTS (t3.small or larger)
- Security group allowing ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 8000 (API)

---

## Step 1 — Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu Server 22.04 LTS**
3. Instance type: **t3.small** (minimum)
4. Configure security group:
   - SSH: port 22 (your IP)
   - HTTP: port 80 (anywhere)
   - Custom TCP: port 8000 (anywhere)
5. Create/select a key pair and download it
6. Launch the instance

---

## Step 2 — Connect to the Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<EC2-PUBLIC-IP>
```

---

## Step 3 — Install Docker and Docker Compose

```bash
# Update packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

---

## Step 4 — Clone the Repository

```bash
git clone https://github.com/satishreddykarri/Agentic-Tree-DataStructure-Visualizer.git
cd Agentic-Tree-DataStructure-Visualizer
```

---

## Step 5 — Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Update these values:
```
DATABASE_URL=postgresql://postgres:yourpassword@postgres:5432/agentic_tree
SECRET_KEY=your-strong-random-secret-key
GROQ_API_KEY=your-groq-api-key
CORS_ORIGINS=http://<EC2-PUBLIC-IP>:80,http://<EC2-PUBLIC-IP>
VITE_API_BASE_URL=http://<EC2-PUBLIC-IP>:8000
POSTGRES_PASSWORD=yourpassword
```

---

## Step 6 — Build and Run

```bash
docker-compose up -d --build
```

Check all services are running:
```bash
docker-compose ps
docker-compose logs backend
```

---

## Step 7 — Verify Deployment

- Frontend: `http://<EC2-PUBLIC-IP>`
- Backend API: `http://<EC2-PUBLIC-IP>:8000/docs`
- Health check: `http://<EC2-PUBLIC-IP>:8000/health`

---

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Update deployment
git pull
docker-compose up -d --build
```
