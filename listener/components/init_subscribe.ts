import { client } from '../listener';
import { getCities } from './city/city.controller';
import { getRestaurants } from './restaurants/restaurants.controller';

const init = () => {
    // susbscribe to the topic: 'compute-cities'
    client.subscribe(process.env.SUBSCRIBE_GET_ALL_CITIES!, getCities);
    client.subscribe(process.env.SUBSCRIBE_GET_ALL_RESTAURANTS!, getRestaurants);
}

export { init };
