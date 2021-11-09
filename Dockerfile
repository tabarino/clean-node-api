# syntax=docker/dockerfile:1

FROM node:14
ENV NODE_ENV=production

WORKDIR /app/clean-node-api

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY ./dist ./dist

CMD npm start

EXPOSE 3000
