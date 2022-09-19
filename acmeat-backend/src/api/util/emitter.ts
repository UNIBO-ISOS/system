import { EventEmitter } from "events";

class Emitter {
    private emitter: any;

    constructor(){
        this.emitter = new EventEmitter()
    }

    addEvent(event: String, fun: Function){
        this.emitter.on(event, fun)
    }

    emit(event: String){
        this.emitter.emit(event)
    }
}

let emitter = new Emitter()

export { emitter }