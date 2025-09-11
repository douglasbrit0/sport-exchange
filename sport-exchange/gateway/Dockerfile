FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm i
COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY ../contracts ./contracts
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/contracts ./contracts
COPY package.json ./
RUN npm i --omit=dev
EXPOSE 4000
CMD ["node", "dist/index.js"]
