FROM node:12-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm ci

EXPOSE 3600

CMD ["npm", "run", "start"]
