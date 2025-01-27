import authservice from '../service/AuthServices';

const authLoader = async () => {
    try {
        const response = await authservice.me();
        return response.data;
    } catch (error) {
            return null
        }
    }

export default authLoader;
    