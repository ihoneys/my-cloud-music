import axios from 'axios';

export const baseUrl = 'http://192.168.1.3:3000';
// export const baseUrl = 'http://10.1.94.90:3000';

export const playMode = {
    sequence: 0,
    loop: 1,
    random: 2
}


//axios 的实例及拦截器配置
const axiosInstance = axios.create({
    baseURL: baseUrl
});

axiosInstance.interceptors.response.use(
    res => res.data,
    err => {
        console.log(err, "网络错误");
    }
);

export {
    axiosInstance
};