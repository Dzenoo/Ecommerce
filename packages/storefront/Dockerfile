FROM node:lts-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/storefront/package.json packages/storefront/

RUN pnpm install

COPY packages/shared packages/shared
COPY packages/storefront packages/storefront

WORKDIR /app/packages/storefront

CMD ["pnpm", "run", "dev"]
