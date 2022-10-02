FROM nginx:latest

COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /usr/src/frontend
WORKDIR /usr/src/frontend

COPY . .

EXPOSE 7770