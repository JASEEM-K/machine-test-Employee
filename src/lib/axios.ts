import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://employee-react.onrender.com/emp",
});

// Add a request interceptor to include the auth token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage or context
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user?.token) {
                config.headers.Authorization = `${user.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
