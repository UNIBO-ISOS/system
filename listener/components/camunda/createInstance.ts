import axios from 'axios'

const createInstance = async (key: string) => {
    try {
        await axios.post(`${process.env.CAMUNDA_PLATFORM!}/process-definition/key/${process.env.CAMUNDA_PROCESS_KEY!}/start/`, { businessKey: key })
    } catch (err) {
        console.log(err)
    }
}

export { createInstance }