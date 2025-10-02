FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV CHOKIDAR_USEPOLLING=true
ENV VITE_API_BASE=${VITE_API_BASE:-http://host.docker.internal:8000}

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]