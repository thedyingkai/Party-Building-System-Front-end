/**
 * SM4 加密/解密工具模块
 * 
 * @description 基于国密 SM4 算法的数据加密和解密工具函数
 * @author 党建系统开发团队
 * @date 2025
 * 
 * SM4 是中国国家密码管理局发布的分组密码算法，用于保护数据传输安全
 * 本模块使用 CBC（Cipher Block Chaining）模式，输出格式为 Base64
 */

const SM4 = require("gm-crypt").sm4;

/**
 * SM4 加密函数
 * 
 * @param {Object|Array|String} data - 需要加密的数据
 * @param {String} key - 加密密钥（16 字节）
 * @param {String} iv - 初始向量（16 字节）
 * @returns {String} Base64 编码的加密数据
 * 
 * @example
 * const encrypted = encryptData({name: '张三'}, 'abcdef1234567890', '1234567890abcdef');
 */
export function encryptData(data, key, iv) {
    // 将数据转换为 JSON 字符串
    const dataString = JSON.stringify(data);

    // SM4 加密配置
    let sm4Config = {
        key: key,               // 密钥
        mode: "cbc",            // CBC 模式
        iv: iv,                 // 初始向量
        cipherType: "base64"    // 输出格式为 Base64
    };

    // 创建 SM4 实例并执行加密
    let sm4 = new SM4(sm4Config);
    return sm4.encrypt(dataString);
}

/**
 * SM4 解密函数
 * 
 * @param {String} encryptedData - Base64 编码的加密数据
 * @param {String} key - 解密密钥（16 字节）
 * @param {String} iv - 初始向量（16 字节）
 * @returns {String} 解密后的原始数据字符串
 * 
 * @example
 * const decrypted = decryptData(encryptedString, 'abcdef1234567890', '1234567890abcdef');
 */
export function decryptData(encryptedData, key, iv) {
    // SM4 解密配置
    let sm4Config = {
        key: key,               // 密钥
        mode: "cbc",            // CBC 模式
        iv: iv,                 // 初始向量
        cipherType: "base64"    // 输入格式为 Base64
    };

    console.log(sm4Config)

    // 创建 SM4 实例并执行解密
    let sm4 = new SM4(sm4Config);
    return sm4.decrypt(encryptedData);
}