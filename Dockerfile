FROM node:16 AS builder

WORKDIR /app

COPY . .

RUN npm ci

# Run tests before building
RUN npm run lint
RUN npm run test

# If tests succeed, build
RUN npm run build
RUN npm prune --production

FROM node:16

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

USER node

CMD ["npm", "run", "start:prod"]
