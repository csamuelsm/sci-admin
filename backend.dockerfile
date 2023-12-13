FROM node:20.9.0

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm i

COPY prisma ./prisma

RUN pnpm prisma generate

#RUN pnpm prisma migrate

COPY . .

EXPOSE 3000

CMD pnpm prisma migrate dev --name init && pnpm dev