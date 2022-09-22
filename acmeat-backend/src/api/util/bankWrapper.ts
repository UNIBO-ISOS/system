import { createClientAsync, Client } from 'soap';

/**
 * Allows the communication of the application 
 * to the bank's service throgh SOAP
 */
class BankWrapper {
    /**
    * path to the wsdl file, it specify the methods implemented by the bank
    */
    private wsdl: string = process.env.WSDL!;
    /**
     * session identification
     */
    private sid: Promise<string>;
    private client: Promise<Client>;

    constructor() {
        this.client = createClientAsync(this.wsdl)
        this.sid = this.login()
    }

    /**
     * 
     * @returns when the promise is completed it returns the value of the session
     */
    private login() : Promise<string>{
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const response = await client.loginAsync({ username: process.env.BANK_USERNAME!, password: process.env.BANK_PASSWORD! })
                const body = response[0]
                resolve(body.sid.$value)
            })
            .catch((err) => {
                reject(err)
                // retry to connect with a timeout of 5s
            })
        })
    }

    /**
     * checks if the transaction is paid
     * @param token id of transaction
     * @param amount the amount to check
     * @returns a promise, if the request succeed a boolean 
     * (true if paid, false otherwise) otherwise the error
     */
    verifyTransaction(token: string, amount: number) {
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const sid = await this.sid
                const response = await client.verifyTransactionAsync({ token: token, sid: sid, to_user: process.env.BANK_USERNAME!, amount: amount })
                console.log(response)
                resolve(response[0].status.$value)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    /**
     * refunds a user when the order is canceled
     * @param token id of transaction
     * @param to_user the user to refund
     * @returns 
     */
    refundTransaction(token: string, to_user: string) {
        return new Promise((resolve, reject) => {
            this.client.then(async (client) => {
                const sid = await this.sid
                const response = await client.refundTransactionAsync({ token: token, to_user: to_user, sid: sid })
                console.log(response)
                resolve(response)
            })
            .catch((err) => {
                reject(err)
            })
        })
    } 

}

let myBank: BankWrapper;

try {
    myBank = new BankWrapper()
} catch(err) {
    throw err;
}

export { myBank }