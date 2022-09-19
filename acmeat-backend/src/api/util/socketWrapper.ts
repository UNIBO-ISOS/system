interface ISocketWrapper {
    socket: Map<String, any>;

    addSocket(id: string, socket: any): void;
    emit(ids: string[], event: string, data: any): void;
}

class SocketWrapper implements ISocketWrapper {
    socket: Map<String, any>;

    constructor() {
        this.socket = new Map();
    }

    addSocket(id: string, socket: any): void {
        this.socket.set(id, socket)
    }
    emit(ids: string[], event: string, data: any): void {
        for(const id of ids) {
            const socket = this.socket.get(id)
            if(socket) {
                socket.emit(event, data)
            }
        }
    }

}

const wrapper = new SocketWrapper();

export { wrapper }