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

const notifyRestaurants = async ({ task, taskService }: HandlerArgs) => {
    try {
        const orderId = task.variables.get("order-id")
        const order = await axios.post(`${process.env.ACME_BACKEND!}/orders/${orderId}/notifyRestaurant`)

        await taskService.complete(task)
    } catch (err) {
        console.log(err)
        await taskService.handleFailure(task)
    }
}

const notifyCouriers = async ({ task, taskService }: HandlerArgs) => {
    try {

    } catch (err) {

    }
}

export { getRestaurants }
