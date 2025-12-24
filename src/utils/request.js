/**
 * Axios 请求封装模块
 * 
 * @description 封装 axios 实例，配置请求/响应拦截器，实现 SM4 加密传输
 * @author 党建系统开发团队
 * @date 2025
 */

import axios from 'axios'
import router from "@/router";
import { decryptData, encryptData } from './sm4';
import CryptoJS from 'crypto-js';

/**
 * 创建 axios 实例
 * @type {AxiosInstance}
 */
const request = axios.create({
    baseURL: process.env.VUE_APP_BASEURL, // API 基础地址
    timeout: 600000 // 请求超时时间：10 分钟
})

// ==================== 请求拦截器 ====================
/**
 * 请求拦截器
 * 在发送请求前进行处理：添加 token、生成 SM4 加密密钥、加密请求数据
 */
request.interceptors.request.use(async config => {
    // 从本地存储获取用户信息
    let user = JSON.parse(localStorage.getItem("current-user") || '{}')
    // 在请求头中添加 token
    config.headers['token'] = user.token;

    // 生成 SM4 加密所需的随机密钥和初始向量（16字节）
    const key = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex).slice(0, 16);
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex).slice(0, 16);

    // 使用 Base64 编码密钥和初始向量
    const encodedKey = btoa(key);
    const encodedIv = btoa(iv);

    // 将加密密钥放入请求头
    config.headers['SM4-Key'] = encodedKey;
    config.headers['SM4-IV'] = encodedIv;

    // 对非 FormData 类型的数据进行 SM4 加密
    if (!(config.data instanceof FormData)) {
        config.data = encryptData(config.data, key, iv);
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }
    return config;
}, error => {
    console.error('request error:' + error);
    return Promise.reject(error);
});

// ==================== 响应拦截器 ====================
/**
 * 响应拦截器
 * 在接收响应后进行处理：解密响应数据、处理错误状态码
 */
request.interceptors.response.use(
    async response => {
        // 获取响应的内容类型
        const contentType = response.headers['content-type'];

        // 从响应头获取 SM4 解密密钥和初始向量
        let key = response.headers['sm4-key'];
        let iv = response.headers['sm4-iv'];

        // Base64 解码密钥和初始向量
        let decodedKey = null;
        let decodedIv = null;

        // 解码密钥
        if (key) {
            const binaryKey = atob(key);
            decodedKey = new Uint8Array(binaryKey.length);
            for (let i = 0; i < binaryKey.length; i++) {
                decodedKey[i] = binaryKey.charCodeAt(i);
            }
            // 将 Uint8Array 转换为字符串
            decodedKey = String.fromCharCode.apply(null, decodedKey);
        }

        // 解码初始向量
        if (iv) {
            const binaryIv = atob(iv);
            decodedIv = new Uint8Array(binaryIv.length);
            for (let i = 0; i < binaryIv.length; i++) {
                decodedIv[i] = binaryIv.charCodeAt(i);
            }
            // 将 Uint8Array 转换为字符串
            decodedIv = String.fromCharCode.apply(null, decodedIv);
        }

        // 处理二进制流响应（文件下载等）
        if (contentType && contentType.includes('application/octet-stream')) {
            const arrayBuffer = await response.data.arrayBuffer();
            const encryptedData = Array.from(new Uint8Array(arrayBuffer));
            const decryptedData = decryptData(encryptedData, decodedKey, decodedIv);
            response.data = new Blob([decryptedData], { type: contentType });
        } else {
            // 处理 JSON 响应
            let res = response.data;

            // 对字符串类型的响应进行解密
            if (typeof res === 'string') {
                try {
                    res = decryptData(res, decodedKey, decodedIv);
                    res = JSON.parse(res);
                    console.log('response:', res);
                } catch (e) {
                    res = null;
                }
            }

            // 处理未授权错误（401），跳转到登录页
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

// ==================== 导出封装的 axios 实例 ====================
export default request;