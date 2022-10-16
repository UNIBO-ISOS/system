import axios from "axios"
import { HandlerArgs } from "camunda-external-task-client-js"

const getRestaurants = async ({ task, taskService }: HandlerArgs) => {
    try {
        console.log(task.variables.get('test'))
        const list = await axios.get(`${process.env.ACME_BACKEND!}/restaurants/${task}`)
        console.log(list.data)
        //task.
        await taskService.complete(task)
    } catch (err) {
        console.log(err)
        // todo - check
        await taskService.handleFailure(task)
    }
}

export { getRestaurants }
