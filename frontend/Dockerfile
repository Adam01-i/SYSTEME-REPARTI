# frontend/Dockerfile

# FROM node:20-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install

# COPY . .

# EXPOSE 5173

# CMD ["npm", "run", "dev", "--", "--host"]

# Étape 1 : build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : serveur nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80 pour Kubernetes
EXPOSE 80

# Lancer nginx
CMD ["nginx", "-g", "daemon off;"]
