# gateway/Dockerfile
# syntax=docker/dockerfile:1.4

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm i

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

# bring in contracts via additional build context
COPY --from=contracts . ./contracts

RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

EXPOSE 4000
CMD ["node","dist/index.js"]
