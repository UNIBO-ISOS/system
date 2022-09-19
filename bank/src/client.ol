include "console.iol"
include "IBank.iol"
include "time.iol"
include "string_utils.iol"

outputPort BankService {
    Location: "socket://localhost:8765"
    Protocol: soap
    Interfaces: BankInterface
}

main{
    keepRunning = false;

    request.username = "client";
    request.password = "cibocibo"

    login@BankService(request)(response);
    login_sid = response.sid;
    Message.sid = response.sid;
    TransactionRequest.sid = response.sid;
    
    println@Console(response.message)();

    if(response.message == "Logged")
    {
        println@Console("Server Responded " + response.message + "\tsid: " + response.sid)();
        keepRunning = true
    } else {
        if(response.message == "NotLogged")
        {
            println@Console("Username does not exist.")()
        }
    }

    while(keepRunning)
    {
        Message.message = "logout";
        
        if (Message.message != "logout"){
            println@Console(Message.message)();

            Message.message = "logout"
        } else {    
            //createTransaction@BankService(Message)(response);
            TransactionRequest.amount = 14.3;

            TransactionRequest.to_user = "acmeat";
            //newTransaction@BankService(TransactionRequest)(TransactionResponse);

            //TransactionRequest.token = "e5701ea8-3083-4af0-9b07-903880dc5bb4";
            //refundTransaction@BankService(TransactionRequest)(TransactionResponse);
            //println@Console("Transaction: " + TransactionMessage.token + "\tverified: " + response.verified)()

            //verifyTransaction@BankService(TransactionRequest)(TransactionResponse);

            //println@Console("stato: " + TransactionResponse.status)();
            
            logout@BankService(Message);
            keepRunning = false

            println@Console("Logged out")()
        }

    }


}