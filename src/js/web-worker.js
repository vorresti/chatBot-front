import CryptoJS from 'crypto-js';

// function enCrypt(objMsg, crypton) {
//   const itemMsg = objMsg;
//   const cryptMsg = CryptoJS.AES.encrypt(itemMsg.msg, crypton).toString();
//   itemMsg.msg = cryptMsg;
//   return itemMsg;
// }

function enCrypt(message, crypton) {
  const currentMessage = message;
  const cryptMessage = CryptoJS.AES.encrypt(currentMessage.msg, crypton).toString();
  currentMessage.msg = cryptMessage;
  return currentMessage;
}

function deCrypt(message, crypton) {
  try {
    const currentMessage = message;
    const decryptedMessage = CryptoJS.AES.decrypt(currentMessage, crypton);
    return decryptedMessage.toString(CryptoJS.enc.Utf8);
    // return retStr;
  } catch (e) {
    console.log('error deCrypt in worker');
    console.log(e);
    return null;
  }
}

self.addEventListener('message', async (event) => { // eslint-disable-line
  let content = '';
  if (event.data.workerCommand === 'enCrypt') {
    content = await enCrypt(event.data.file, event.data.keyCrypt);
    self.postMessage(content); // eslint-disable-line
  } else if (event.data.workerCommand === 'deCrypt') {
    for (const item of event.data.file) {
      const itemMessage = JSON.parse(item);
      content = deCrypt(itemMessage.msg, event.data.keyCrypt);
      itemMessage.msg = content;
      self.postMessage(itemMessage); // eslint-disable-line
    }
    self.close(); // eslint-disable-line
  }
});
