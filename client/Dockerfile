FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]