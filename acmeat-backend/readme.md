# ACME backend

REST server that implements the capabilities of ACMEat.
In particular, it allows the users to order takeaway food from one of the affiliate restaurants.
The delivery is handled automatically choosing the cheapest courier (affiliate with ACMEat).

## Prerequisites

- [docker](https://www.docker.com/products/docker-desktop)
    - for the systems that uses linux as OS, it is necessary to install [docker compose](https://docs.docker.com/compose/install/)
- it is advised to use [postman](https://www.postman.com/downloads/) in order to be able to use the documentation of the [API](/acmeat-backend/acmeat-backend%20API.postman_collection.json)

## Documentation

The following [file](/acmeat-backend/acmeat-backend%20API.postman_collection.json) contains the documentation of the APIs implemented by ACMEat.

## Architecture

The application is composed of the following components:

- *acmeat_backend*: implements the REST server using the [express](https://expressjs.com/) library

    - *bankWrapper*: module that allows to communicate with the bank's service, the dialogue is based on the [file wsdl](/acmeat-backend//src//api/util/testWsdl.wsdl) shared with the bank

- *mongo*: database for the saving of data and for the geospatial queries

![Architecture of the application](/acmeat-backend/Architettura%20backend.png "Architecture")

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

## Initialization of database

To avoid the manual inserting of the data in the database the data are automatically inserted with the seeding's mechanism.
The inserted data are:

- *user*: two users for each role, the credentials of access are available [here](/acmeat-backend/src/api/util/credentials.txt)
- *city*: the city where the service is active
- *restaurant*: the restaurants affiliate with ACMEat
- *courier*: the couriers affiliate with ACMEat

The data are available in the following directory `/acmeat-backend/src/api/mongo-data`