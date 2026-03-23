FROM node:lts-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/admin/package.json packages/admin/

RUN pnpm install

COPY packages/shared packages/shared
COPY packages/admin packages/admin

WORKDIR /app/packages/admin

CMD ["pnpm", "run", "dev"]
