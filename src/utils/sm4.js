const SM4 = require("gm-crypt").sm4;

// 加密函数
export function encryptData(data, key, iv) {
    const dataString = JSON.stringify(data);
    let sm4Config = {
        key: key,
        mode: "cbc",
        iv: iv,
        cipherType: "base64"
    };
    let sm4 = new SM4(sm4Config);
    return sm4.encrypt(dataString);
}

// 解密函数
export function decryptData(encryptedData, key, iv) {
    let sm4Config = {
        key: key,
        mode: "cbc",
        iv: iv,
        cipherType: "base64"
    };
    console.log(sm4Config)
    let sm4 = new SM4(sm4Config);
    return sm4.decrypt(encryptedData);
}