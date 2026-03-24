FROM node:lts-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/shop/package.json packages/shop/

RUN pnpm install

COPY packages/shared packages/shared
COPY packages/shop packages/shop

WORKDIR /app/packages/shop

CMD ["pnpm", "run", "dev"]
