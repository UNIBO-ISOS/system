FROM node:16

RUN mkdir -p /usr/src/acmeat_backend
WORKDIR /usr/src/acmeat_backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "serve" ]