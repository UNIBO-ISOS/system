# ACME backend

Server REST che implementa le capabilities dell'azienda ACMEat.
In particolare, permette agli utenti iscritti di ordinare cibo da asporto da uno dei ristoranti convenzionati.
Per la consegna l'applicativo si occupa di selezionare l'azienda di delivery migliore in maniera automatica.

## Prerequisiti

- aver installato [docker](https://www.docker.com/products/docker-desktop)
    - su sistemi di tipo linux, si richiede l'installazione di [docker compose](https://docs.docker.com/compose/install/)
- si consiglia l'utilizzo di [postman](https://www.postman.com/downloads/) per poter usufruire della documentazione delle API

## Documentazione

Il seguente [file](/acmeat-backend/acmeat-backend%20API.postman_collection.json) contiene la documentazione delle API implementate da ACMEat.

## Architettura

L'applicazione è costituita dalle seguenti componenti:

- *acmeat_backend*: implementa il server REST utilizzando la libreria [express](https://expressjs.com/)

    - *bankWrapper*: modulo che permette di comunicare con il servizio bancario, il dialogo è basato sul [file wsdl](/acmeat-backend//src//api/util/testWsdl.wsdl) condiviso con l'istituto bancario

- *mongo*: database per la persistenza dei dati e per le query con coordinate geografiche

![Architettura dell'applicazione](/acmeat-backend/Architettura%20backend.png "Architettura")

## Eseguire l'applicazione

Spostarsi nella directory contenente il file Docker-compose (`./progetto/acmeat-backend`).

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

## Inizializzazione del database

Per evitare l'inserimento manuale di dati il database viene inizializzato con i dati attraverso il meccanismo di seeding.
I dati inseriti sono:

- *user*: due utenti per ruolo, le credenziali di accesso sono disponibili [qui](/acmeat-backend/src/api/util/credentials.txt)
- *city*: le città in cui il servizio è attivo
- *restaurant*: i ristornati convenzionati con acme
- *courier*: i corriri convenzionati con acme

I dati sono nella cartella `/acmeat-backend/src/api/mongo-data`