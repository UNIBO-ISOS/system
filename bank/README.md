# Jolie BANK Service

> `jolie Bank.ol` to run the server

> `jolie client.ol` to run the client

---

## Methods

`newTransaction` creates a new transaction on the Transaction table

`refundTransaction` undo a transaction, and changes the status value

`verifyTransaction` verifies if a transaction exists on the Transaction table

---

## Transaction Table

| Key           |     Type      |               |                   |
| ------------- | :-----------: | :-----------: |  -----------      |
| id            |   INTEGER     |   PRIMARY KEY |   AUTOINCREMENT   |
| token         |   TEXT        |   NOT NULL    |   UNIQUE          |
| amount        |   DOUBLE      |   NOT NULL    |                   |
| from_user     |   TEXT        |   NOT NULL    |                   |
| to_user       |   TEXT        |   NOT NULL    |                   |
| status        |   TEXT        |   NOT NULL    |                   |

## User Table

| Key           |     Type      |               |                   |
| ------------- | :-----------: | :-----------: |  -----------      |
| id            |   INTEGER     |   PRIMARY KEY |   AUTOINCREMENT   |
| username      |   TEXT        |   NOT NULL    |   UNIQUE          |
| password      |   TEXT        |   NOT NULL    |                   |
| balance       |   DOUBLE      |   NOT NULL    |                   |