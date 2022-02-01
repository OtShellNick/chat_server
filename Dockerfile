FROM node:14-alpine AS builder
COPY . ./home/chat_server
WORKDIR ./home/chat_server

RUN npm install

CMD ["npm", "run", "start"]