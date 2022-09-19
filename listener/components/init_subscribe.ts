import { client } from '../listener'
import { cities } from './city/city.controller'

const init = () => {
    // susbscribe to the topic: 'compute-cities'
    client.subscribe(process.env.SUBSCRIBE_GET_ALL_CITIES!, cities);
}

export { init }