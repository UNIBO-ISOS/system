import axios from 'axios'
import { HandlerArgs } from 'camunda-external-task-client-js'

const getCities = async ({ task, taskService }: HandlerArgs) => {
    try {
        const list = await axios.get(`${process.env.ACME_BACKEND!}/cities/`)

        await taskService.complete(task, undefined, undefined)
    } catch (error) {
        // todo - check
        await taskService.handleFailure(task)
    }
}


export {
    getCities
}
