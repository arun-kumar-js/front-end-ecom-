import instance from "./instance";
const authService = {
    register: async (data) => {
        return await instance.post('/register',data)
    },
    login: async (data) => {
        return await instance.post('/login',data)
    },
    logout: async () => {
        return await instance.post('/logout')
    },
    me: async () => {
        return await instance.get('/me')
    }  
}
export default authService;