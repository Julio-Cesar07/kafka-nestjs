FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/app

USER node

RUN npm install -g pnpm
RUN pnpm i

CMD [ "tail", "-f", "/dev/null" ]