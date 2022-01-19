import axios from 'axios'
import {errorCodeDescription} from '/src/lib/services/error_code'

const BASE_URL = "/api"

export const createApiRequest = async ({url, method, data, params, baseUrl = BASE_URL}) => {
    try {
        const {data: resp} = await axios({
            method,
            url: `${baseUrl}${url}`,
            data,
            params
        })
        return resp
    } catch (e) {
        console.log(e)
        const {response} = e
        if (
            response.data &&
            errorCodeDescription.hasOwnProperty(response.data.status)
        ) {
            throw errorCodeDescription[response.data.status]
        } else {
            throw errorCodeDescription.UNKNOWN
        }
    }
}

// export const createAuthApiRequest = async ({
//     url,
//     method,
//     data,
//     params,
//     isFormData,
//     props
// }) => {
//     try {
//         const token = getCookie(COOKIE_KEY.TOKEN)
//         const { data: resp } = await axios({
//             method,
//             url: `${baseUrl}${url}`,
//             data,
//             params,
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 ...(isFormData && { 'Content-Type': 'multipart/form-data' })
//             }
//         })

//         return resp
//     } catch (e) {
//         const { response } = e
//         if (!response) throw new Error('Unable to get response!')
//         if (response.status && [401, 403].includes(response.status)) {
//             logout()
//             if (props) {
//                 setSessionStorage(
//                     SESSION_KEY.REDIRECT_URL,
//                     props.location.pathname + props.location.search
//                 )
//             }

//             window.location.href = Paths.Login
//         }
//         if (
//             response.data &&
//             errorCodeDescription.hasOwnProperty(response.data.status)
//         ) {
//             throw errorCodeDescription[response.data.status]
//         } else {
//             throw errorCodeDescription.UNKNOWN
//         }
//     }
// }
