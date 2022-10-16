FROM node:16

RUN mkdir -p /usr/src/listener
WORKDIR /usr/src/listener

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7070

CMD [ "npm", "run", "serve" ]