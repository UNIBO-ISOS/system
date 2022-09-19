import { emitter} from './emitter'

function delay(delay: number){
    return new Promise( r => {
        setTimeout(r, delay)
    })
}

class Timer {
    private counter = 15
    private orderId

    constructor(orderId: String){
        this.orderId = orderId
        this.doTimer()
    }

    async doTimer() {
        for (let i = 0; i < this.counter; i++) {
            await delay(1000)
        }

        //  todo: magia
        emitter.emit(this.orderId)
    }
}

export { Timer }