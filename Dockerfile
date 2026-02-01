# Use Node 20
FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json jest.config.ts ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
RUN npm run build

EXPOSE 4001
CMD ["node", "dist/server.js"]
