# MED-PRO API image. Runs pending migrations on start, then boots the server.
FROM node:20-alpine
WORKDIR /app

# Install deps (prisma CLI is needed at runtime for `migrate deploy`).
COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
