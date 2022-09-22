# Progetto Ingegneria del Software Orientata ai Servizi

Questo repository contiene i sorgenti del progetto di ISOS 2022.

## Prerequisiti

- aver installato [docker](https://www.docker.com/products/docker-desktop)
    - su sistemi di tipo linux, si richiede l'installazione di [docker compose](https://docs.docker.com/compose/install/)

## Eseguire l'applicazione

Spostarsi nella directory principale contenente il file docker-compose (`./progetto`).

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

## Architettura

L'applicazione è composta dai seguenti servizi (container):

-  **acmeat_backend**: server REST che espone le API dell'azienda acmeat, per maggiori informazioni [clicca qui](/acmeat-backend/readme.md)
- **mongo_database**: database non relazionale utilizzato da *acmeat_backend*, utilizzato per effettuare query geografiche ([GeoJSON](https://www.mongodb.com/docs/manual/reference/geojson/))
- **bank**: server SOAP che simula un istituto bancario, gestisce i pagamenti e i bilanci degli utenti

    - per la persistenza utilizza *[SQLite](https://www.sqlite.org/index.html)*

- **camunda**: immagine ufficiale di camunda
- **listener**: wrapper che dialoga con *camunda* e *acmeat_backend* per gestire la gestione delle human workflow

La seguente immagine rappresenta l'architettura appena descritta in maniera grafica, ogni nuvola rappresenta un servizio distinto e i principali componenti.

![Architettura dell'applicazione](/application_architecture.png "Architettura")