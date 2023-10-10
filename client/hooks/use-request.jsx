import { useState } from "react"
import axios from 'axios'


const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null)

    const doRequest = async () => {
        try {
            setErrors(null)
            const response = await axios[method](url, body)
            if (onSuccess) {
                onSuccess(response.data)
            }
            return response.data
        } catch (error) {
            console.log(error)
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {error.response ?
                            error.response.data.errors.map((err, i) => <li key={i}>{err.message}</li>)
                            :
                            <li>Try Again Later</li>
                        }

                    </ul>
                </div>
            )
        }
    }

    return { doRequest, errors }
}

export default useRequest