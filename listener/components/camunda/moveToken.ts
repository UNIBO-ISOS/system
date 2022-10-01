import axios from 'axios'

const moveToken = async  (messageName: string) => {
    try {
        const response = await axios.post(process.env.CAMUNDA_PLATFORM! + '/message/', {
            messageName: messageName,
            businessKey: process.env.BUSINESS_KEY!,
            resultEnabled: true
        })

        return response.status

    } catch (err) {
        console.log(err)
    }
    
}

export { moveToken }