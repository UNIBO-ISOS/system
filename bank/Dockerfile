FROM alpine:3.16

ENV LANG=C.UTF-8

RUN apk add --no-cache openjdk11
RUN apk update
RUN apk add maven
RUN apk add apache-ant
RUN apk add git
RUN apk add nano

RUN git clone --depth=1 https://github.com/jolie/jolie.git jolie-git
WORKDIR /jolie-git
RUN mvn install
RUN mkdir /usr/lib/jolie
RUN cp dist/jolie/* /usr/lib/jolie -r
RUN cp dist/launchers/unix/* /usr/bin
ENV JOLIE_HOME=/usr/lib/jolie

WORKDIR //

COPY jdbc-sqlite.jar /usr/lib/jolie/lib/

WORKDIR /acmeat/bank-service

COPY src/ src/

EXPOSE 8765

WORKDIR /acmeat/bank-service/src

CMD [ "jolie", "Bank.ol" ]