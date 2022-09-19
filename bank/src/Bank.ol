include "console.iol"
include "IBank.iol"
include "time.iol"
include "database.iol"
include "string_utils.iol"

/**
 *  Setting input port
 */
inputPort BankService {
    Location: "socket://localhost:8765" 
    //Protocol: http { .format =  "json"}
    Protocol: soap
    Interfaces: BankInterface
}

cset {
    sid: Message.sid
}

cset {
    sid: NewTransactionRequest.sid
}

cset {
    sid: RefundTransactionRequest.sid
}

cset {
    sid: VerifyTransactionRequest.sid
}

execution { concurrent }

init{
    println@Console("Server Started..")();

    keepRunning = false

    with(connectionInfo){
        .username = "acme";
        .password = "eat";
        .host = "";
        .database = "file:acmeatdb/acmeatdb.db";
        .driver = "sqlite"
    };
    connect@Database(connectionInfo)();
    println@Console("Connected to DB")();

    scope(createTable){
        install(SQLException => println@Console("ACMEat table already exists.")());

        update@Database(
            "CREATE TABLE IF NOT EXISTS Transactions(" +
            "id         INTEGER     PRIMARY KEY     AUTOINCREMENT, " +
            "token      TEXT        NOT NULL        UNIQUE, " +
            "amount     DOUBLE      NOT NULL , " +
            "from_user  TEXT        NOT NULL , " +
            "to_user    TEXT        NOT NULL , " +
            "status     TEXT        NOT NULL );"
        )( result1 )

        update@Database(
            "CREATE TABLE IF NOT EXISTS Users("+
            "id         INTEGER     PRIMARY KEY     AUTOINCREMENT, " +
            "username   TEXT        NOT NULL        UNIQUE, " +
            "password   TEXT        NOT NULL, " +
            "balance    DOUBLE      NOT NULL );"
        )( result2 )

        
        /*update@Database(
            "INSERT INTO Users (username, password, balance) VALUES (:username, :password, :balance)" {
                .username = "acmeat",
                .password = "soldisoldi"
                .balance = 5200
            }
        )(resus)

        update@Database(
            "INSERT INTO Users (username, password, balance) VALUES (:username, :password, :balance)" {
                .username = "client",
                .password = "cibocibo"
                .balance = 5000
            }
        )(resus)*/
        
    }
}

main{
    login(login_request)(login_response){
        username = login_request.username;
        login_response.sid = csets.sid = new;
        login_response.message="NotLogged";

        query@Database(
            "SELECT * FROM Users WHERE username=:username" {
                .username = login_request.username
            }
        )(sqlResponse);
        if (#sqlResponse.row == 1) {
            values -> sqlResponse.row;

            userIndex = values.username;

            if(sqlResponse.row.password == login_request.password){
                println@Console("user: '" + userIndex + "' logged in.")();
                keepRunning = true;
                login_response.message = "Logged"
            }
        }
    }
    while(keepRunning){

        /*  BANK QUERIES
          #################
            -------------
          #################
        */
        
        //  AGGIUNGERE CONTROLLO SU BILANCIO NON SUFFICIENTE
        [ newTransaction(newTransaction_request)(newTransaction_response) {
            uuid_exists = true
            enough_balance = false
            synchronized(lock){


                while(uuid_exists) {
                    getRandomUUID@StringUtils()(uuid)
                    println@Console("Checking new Transaction Token: " + uuid + " - availability...")()

                    query@Database(
                        "SELECT * FROM Transactions WHERE token=:token" {
                            .token = uuid
                        }
                    )(sqlResponse);
                    if (#sqlResponse.row == 0) {
                        //response.values -> sqlResponse.row;
                        println@Console("Transaction Token: " + uuid + "\tavailable. Inserting to the table.")();
                        uuid_exists = false
                    }
                }

                query@Database(
                    "SELECT balance FROM Users WHERE username=:username" {
                        .username = username
                    }
                )(checkBalanceResponse);

                if (#checkBalanceResponse.row) {
                    if(checkBalanceResponse.row.balance >= newTransaction_request.amount)
                        enough_balance = true
                }

                if(enough_balance){    
                    query@Database(
                    "SELECT balance FROM Users WHERE username=:username" {
                        .username = username
                    }
                    )(sqlResponse);
                    if (#sqlResponse.row == 1) {
                        new_balance = sqlResponse.row.balance - newTransaction_response.amount;

                        update@Database(
                            "UPDATE Users SET balance=:balance WHERE username=:username" {
                                .username = username,
                                .balance = new_balance
                            }
                        )(dbresponse.status)
                    }

                    query@Database(
                        "SELECT balance FROM Users WHERE username=:username" {
                            .username = newTransaction_response.to_user
                        }
                    )(sqlResponse);
                    if (#sqlResponse.row == 1) {
                        new_balance = sqlResponse.row.balance + newTransaction_response.amount;

                        update@Database(
                            "UPDATE Users SET balance=:balance WHERE username=:username" {
                                .username = newTransaction_response.to_user,
                                .balance = new_balance
                            }
                        )(dbresponse.status)
                    }
                    
                    update@Database(
                        "INSERT INTO Transactions (token, amount, from_user, to_user, status) VALUES (:token, :amount, :from_user, :to_user, :status)" {
                            .token = uuid,
                            .amount = newTransaction_request.amount,
                            .from_user = username,
                            .to_user = newTransaction_request.to_user,
                            .status = "created"
                        }
                    )(dbresponse.status)
                    
                    newTransaction_response.status = true;
                    newTransaction_response.token = uuid;

                    if(newTransaction_response.status){
                        println@Console("Created transaction:\t" + newTransaction_response.token)()
                    } else {
                        println@Console("Impossible to create transaction:\t" + newTransaction_response.token + "\t. Balance too low")()
                    }
                }
            }
        } ]

        [ refundTransaction(refundTransaction_request)(refundTransaction_response) {
            proceed_refund = false;
            amount_to_refund = 0;
            user_to_refund = username;

            synchronized(lock){
                refundTransaction_response.status = false

                query@Database(
                    "SELECT * FROM Transactions WHERE token=:token" {
                        .token = refundTransaction_request.token
                    }
                )(sqlRefundResponse);
                if (#sqlRefundResponse.row) {
                    if(sqlRefundResponse.row.to_user == username && sqlRefundResponse.row.status != "refunded")
                    {   
                        proceed_to_refund   = true;
                        amount_to_refund    = sqlRefundResponse.row.amount
                        user_to_refund      = sqlRefundResponse.row.from_user

                        query@Database(
                            "SELECT balance FROM Users WHERE username=:username" {
                                .username = user_to_refund
                        }
                        )(sqlResponse);
                        if (#sqlResponse.row == 1) {
                            new_balance = sqlResponse.row.balance + sqlRefundResponse.row.amount;

                            update@Database(
                                "UPDATE Users SET balance=:balance WHERE username=:username" {
                                    .username = user_to_refund,
                                    .balance = new_balance
                                }
                            )(dbresponse.status)
                        } else {
                            proceed_to_refund = false
                        }

                        if(proceed_to_refund){
                            query@Database(
                            "SELECT balance FROM Users WHERE username=:username" {
                                .username = username
                            }
                            )(sqlResponse);
                            if (#sqlResponse.row == 1) {
                                new_balance = sqlResponse.row.balance - sqlRefundResponse.row.amount;

                                update@Database(
                                    "UPDATE Users SET balance=:balance WHERE username=:username" {
                                        .username = username,
                                        .balance = new_balance
                                    }
                                )(dbresponse.status)
                            } else {
                                proceed_to_refund = false
                            }
                        }

                        if(proceed_to_refund){
                            update@Database(
                                "UPDATE Transactions SET status=:status WHERE token=:token" {
                                    .token = refundTransaction_request.token,
                                    .status = "refunded"
                                }
                            )(dbresponse.status)

                            refundTransaction_response.status = true
                        }
                    }

                    if(refundTransaction_response.status){
                        println@Console("Succeded to refund transaction with Token: " + uuid)()
                    } else {
                        println@Console("Failed to refund transaction with Token: " + uuid)()
                    }
                }
            }
        } ]

        //  controlla se il token esiste ed il destinatario sono gli stessi passati nella richiesta
        [ verifyTransaction(verifyTransaction_request)(verifyTransaction_response) {
            synchronized(lock){
                verifyTransaction_response.status = false

                query@Database(
                    "SELECT * FROM Transactions WHERE token=:token" {
                        .token = verifyTransaction_request.token
                    }
                )(sqlVerifyResponse);
                if (#sqlVerifyResponse.row && 
                        sqlVerifyResponse.row.to_user == verifyTransaction_request.to_user &&
                        sqlVerifyResponse.row.amount == verifyTransaction_request.amount
                        ) {
                    if(sqlVerifyResponse.status == "created"){
                        update@Database(
                        "UPDATE Transactions SET status=:status WHERE token=:token" {
                            .token = verifyTransaction_request.token,
                            .status = "verified"
                        }
                    )(dbresponse.status)
                    
                    verifyTransaction_response.status = true
                    }
                }

                if(verifyTransaction_response.status){
                    println@Console("Transaction Token: " + uuid + "\tverified.")()
                } else {
                    println@Console("Transaction Token: " + uuid + "\tNOT verified.")()
                }

            }
        } ]



        /*  DB QUERIES
          #################
            -------------
          #################
        */

    /*

        [ retrieveAllTransactions(response)(response) {
            query@Database(
                "SELECT * FROM Transactions"
            )(sqlResponse);
            response.values -> sqlResponse.row
        } ]

        [ retrieveAllUsers(request)(response) {
            query@Database(
                "SELECT * FROM Users"
            )(sqlResponse);
            response.values -> sqlResponse.row
        } ]
        
        [ createTransaction(request)(response) {
            update@Database(
                "INSERT INTO Transactions (token, amount, from_user, to_user) VALUES (:token, :amount, :from_user, :to_user)" {
                    .token = uuid,
                    .amount = request.amount,
                    .from_user = request.from_user,
                    .to_user = request.to_user,
                }
            )(response.status)
        } ]

        [ createUser(request)(response) {
            update@Database(
                "INSERT INTO Users (username, balance) VALUES (:username, :balance)" {
                    .username = request.username,
                    .balance = request.balance
                }
            )(response.status)
        } ]

        [ retrieveTransactionByID(request)(response) {
            query@Database(
                "SELECT * FROM Transactions WHERE id=:id" {
                    .id = request.id
                }
            )(sqlResponse);
            if (#sqlResponse.row == 1) {
                response -> sqlResponse.row[0]
            }
        } ]  

        [ retrieveTransactionByToken(request)(response) {
            query@Database(
                "SELECT * FROM Transactions WHERE token=:token" {
                    .token = request.token
                }
            )(sqlResponse);
            if (#sqlResponse.row == 1) {
                response -> sqlResponse.row[0]
            }
        } ]  

        [ retrieveUserByID(request)(response) {
            query@Database(
                "SELECT * FROM Users WHERE id=:id" {
                    .id = request.id
                }
            )(sqlResponse);
            if (#sqlResponse.row == 1) {
                response -> sqlResponse.row[0]
            }
        } ]   

        [ retrieveUserByUsername(request)(response) {
            query@Database(
                "SELECT * FROM Users WHERE username=:username" {
                    .username = request.username
                }
            )(sqlResponse);
            if (#sqlResponse.row == 1) {
                response -> sqlResponse.row[0]
            }
        } ]   

        [ update(request)(response) {
            update@Database(
                "UPDATE Transactions SET status=:status WHERE id=:id" {
                    .status = false,
                    .id = request.id
                }
            )(response.status)
        } ]

        [ delete(request)(response) {
            update@Database(
                "DELETE FROM Transactions WHERE id=:id" {
                    .id = request.id
                }
            )(response.status)
        } ]

    */

        [ logout( request )] {
            println@Console("User " + username + " logged out.")();
            keepRunning = false
        }
    }
}