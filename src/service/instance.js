import axios from "axios";
import e from "cors";
const baseURL = "https://project-be-lkrg.onrender.com/auth";
const instance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default instance;
