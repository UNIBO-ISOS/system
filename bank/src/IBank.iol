type LoginRequest: void {
	.username: string
    .password: string
}

type Message: void {
    .sid: string
    .message?: string
    .username?: string
}

type NewTransactionRequest: void {
    .sid: string
    .amount: double
    .to_user: string
}

type RefundTransactionRequest: void {
    .sid: string
    .token?: string
}

type VerifyTransactionRequest: void {
    .sid: string
    .token: string
    .amount: double
    .to_user: string
}

type TransactionResponse: void {
    .token?: string
    .status?: bool
}

interface BankInterface {
    RequestResponse:
        login(LoginRequest)(Message),

        //  BANK QUERIES
        newTransaction(NewTransactionRequest)(TransactionResponse),
        refundTransaction(RefundTransactionRequest)(TransactionResponse),
        verifyTransaction(VerifyTransactionRequest)(TransactionResponse),

        //  DB TESTING QUERIES
        /*
        retrieveAllTransactions(Message)(undefined),
        retrieveAllUsers(Message)(undefined),
        createTransaction(Message)(undefined),
        createUser(Message)(undefined),
        retrieveTransactionByID(undefined)(undefined),
        retrieveTransactionByToken(undefined)(undefined),
        retrieveUserByID(undefined)(undefined),
        retrieveUserByUsername(undefined)(undefined),
        update(undefined)(undefined),
        delete(undefined)(undefined)
        */
    OneWay:
        logout(Message)
}