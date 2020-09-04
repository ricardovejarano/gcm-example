const crypto = require('crypto');


const randomKey = process.env.KEY_BC;

const randomIv = process.env.IV_BC;

const getEncryptValue = (str) => {
    const algorithm = 'aes-256-gcm';
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(randomKey, 'base64'), Buffer.from(randomIv, 'base64'));
    let enc = cipher.update(str, 'utf8', 'base64');
    enc += cipher.final('base64');
    return [enc, randomIv, randomKey, cipher.getAuthTag()];
}

const decrypt = (enc, iv, key, authTag) => {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'base64'), Buffer.from(iv, 'base64'));
    decipher.setAuthTag(authTag);
    let str = decipher.update(enc, 'base64', 'utf8');
    str += decipher.final('utf8');
    return str;
  };


const triggerService = async (messageToEncrypt) => {
    const [enc, randomIv, randomKey, cipher ] = getEncryptValue(messageToEncrypt);
    const encryptedData = {
        enc,
        randomIv,
        randomKey,
        cipher
    }
    return encryptedData;
}
const message = 'Camilin';
triggerService(message)
.then(result => {
    console.log(result);
    let dec = decrypt(result.enc, randomIv, randomKey, result.cipher);
    console.log(dec);
})
.catch(err => new Error('Error at triggerService'));
