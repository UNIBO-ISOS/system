# ACME backend

Applicazione che permette agli utenti selezionati di ordinare cibo, tra i locali convenzionati, e di riceverli a domicilio.

## Prerequisiti

- aver installato [docker](https://www.docker.com/products/docker-desktop)
    - su sistemi di tipo linux, si richiede l'installazione di [docker compose](https://docs.docker.com/compose/install/)
- si consiglia l'utilizzo di [postman](https://www.postman.com/downloads/) per poter usufruire della documentazione delle API

## Eseguire l'applicazione

Spostarsi nella directory contenente il file Docker-compose (`./acmeat-backend`).

* Digitare ed eseguire il seguente comando
    ```
        docker-compose up
    ```
* Per effettuare il rebuild dell'applicazione (necessario in caso di aggiornamento dei sorgenti) digitare e eseguire il comando
    ```
        docker-compose up --build
    ```
    o
    ```
        docker-compose build
    ```
* L'applicazione sarà disponibile all'indirizzo [http://localhost:5000](http://localhost)