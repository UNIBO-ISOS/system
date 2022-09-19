import axios from 'axios'
import { Handler, HandlerArgs, Variables } from 'camunda-external-task-client-js'

const cities = async ({ task, taskService }: HandlerArgs) => {
    try {
        const list = await axios.get(`${process.env.ACME_BACKEND!}/cities/`)

        const cityList = new Variables()
        cityList.set("cities", list.data)

        await taskService.complete(task, undefined, cityList)
    } catch(err) {
        console.log(err)
        // todo - check
        await taskService.handleFailure(task)
    }
}

const getRestaurants = async ({ task, taskService }: HandlerArgs) => {
    try {
        console.log(task.variables.get('test'))
        const list = await axios.get(`${process.env.ACME_BACKEND!}/restaurants/${task}`)
        console.log(list.data)
        //task.
        await taskService.complete(task)
    } catch(err) {
        console.log(err)
        // todo - check
        await taskService.handleFailure(task)
    }
}

export {
    cities
}

