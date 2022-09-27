# Ingegneria del Software Orientata ai Servizi Project

This repository contains the source code of the ISOS project 2022.

## Prerequisites

- [docker](https://www.docker.com/products/docker-desktop)
    - for the systems that uses linux as OS, it is necessary to install [docker compose](https://docs.docker.com/compose/install/)

## Run the application

Move to the directory that contains the docker-compose file (`./progetto/acmeat-backend`).

* run the following command
    ```
        docker-compose up
    ```
* to rebuild the application (necessary when the source code is updated) run the following command
    ```
        docker-compose up --build
    ```
    or
    ```
        docker-compose build
    ```
* The application will be available at [http://localhost:5000](http://localhost)

## Architecture

The application is composed of the following services (container):

-  **acmeat_backend**: REST server that implements the APIs of ACMEat, for more information [click here](/acmeat-backend/readme.md)
- **mongo_database**: no relational database (NoSQL) used by *acmeat_backend*, necessary to save data and make geospatial queries  ([GeoJSON](https://www.mongodb.com/docs/manual/reference/geojson/))
- **bank**: SOAP server that simulate a bank, it handles the payments and the account balance of users

    - to save data it uses *[SQLite](https://www.sqlite.org/index.html)*

- **camunda**: official image of camunda
- **listener**: wrapper that dialogue with *camunda* and *acmeat_backend* to handle human workflow

The following image represents the architecture of the described application in a graphical way, each cloud represents a distinct service.

![Application's Architecture](/application_architecture.png "Architecture")