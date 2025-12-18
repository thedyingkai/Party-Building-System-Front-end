import axios from 'axios'
import router from "@/router";
import {decryptData, encryptData} from './sm4';
import CryptoJS from 'crypto-js';

const request = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,
    timeout: 600000
})

// 请求拦截器
request.interceptors.request.use(async config => {
    let user = JSON.parse(localStorage.getItem("current-user") || '{}')
    config.headers['token'] = user.token;

    const key = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex).slice(0, 16);
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex).slice(0, 16);
    // 使用Base64编码
    const encodedKey = btoa(key);
    const encodedIv = btoa(iv);
    config.headers['SM4-Key'] = encodedKey;
    config.headers['SM4-IV'] = encodedIv;

    if (!(config.data instanceof FormData)) {
        config.data = encryptData(config.data, key, iv);
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }
    return config;
}, error => {
    console.error('request error:' + error);
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
    async response => {
        const contentType = response.headers['content-type'];
        let key = response.headers['sm4-key'];
        let iv = response.headers['sm4-iv'];
        // 使用Base64解码
        let decodedKey = null;
        let decodedIv = null;
        if (key) {
            const binaryKey = atob(key);
            decodedKey = new Uint8Array(binaryKey.length);
            for (let i = 0; i < binaryKey.length; i++) {
                decodedKey[i] = binaryKey.charCodeAt(i);
            }
            // 将 Uint8Array 转换为字符串
            decodedKey = String.fromCharCode.apply(null, decodedKey);
        }
        if (iv) {
            const binaryIv = atob(iv);
            decodedIv = new Uint8Array(binaryIv.length);
            for (let i = 0; i < binaryIv.length; i++) {
                decodedIv[i] = binaryIv.charCodeAt(i);
            }
            // 将 Uint8Array 转换为字符串
            decodedIv = String.fromCharCode.apply(null, decodedIv);
        }

        if (contentType && contentType.includes('application/octet-stream')) {
            const arrayBuffer = await response.data.arrayBuffer();
            const encryptedData = Array.from(new Uint8Array(arrayBuffer));
            const decryptedData = decryptData(encryptedData, decodedKey, decodedIv);
            response.data = new Blob([decryptedData], {type: contentType});
        } else {
            let res = response.data;
            if (typeof res ==='string') {
                try {
                    res = decryptData(res, decodedKey, decodedIv);
                    res = JSON.parse(res);
                    console.log('response:', res);
                } catch (e) {
                    res = null;
                }
            }
            if (res && res.code === '401') {
                router.push('/login');
            }
            response.data = res;
        }
        return response.data;
    },
    error => {
        console.error('response error' + error);
        return Promise.reject(error);
    }
);

export default request;