import CryptoJS from 'crypto-js';
// const CryptoJS = require('crypto-js');

export default class Crypt {
  constructor(keyCrypt) {
    this.keyCrypt = keyCrypt;
  }

  enCrypt(data) {
    return CryptoJS.AES.encrypt(data, this.keyCrypt).toString();
  }

  deCrypt(data) {
    if (data) {
      try {
        const bytes = CryptoJS.AES.decrypt(data, this.keyCrypt);
        const retStr = bytes.toString(CryptoJS.enc.Utf8);
        return retStr;
      } catch (e) {
        console.log('WTF!!! deCrypt Error');
        console.log(data);
        console.log(e);
        return null;
      }
    } else {
      return null;
    }
  }
}
