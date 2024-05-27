import axios from "axios";
import { clearCookie } from "./auth";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});
//inntercept response and check unauthorized response
axiosSecure.interceptors.response.use(response => response, async (error) => {
    if (error.response && (
        error.response.status === 401 ||
        error.response.status === 403
    )) {
        await clearCookie()
        /* window.location.replace('/') */
    }
    return Promise.reject(error)
})


export default axiosSecure;