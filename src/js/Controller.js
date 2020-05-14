import Worker from './web-worker.js';
import Messanger from './Messanger.js';
import Crypton from './Crypt.js';

const currentMessages = [];
const pathToServer = 'ahj-diploma.herokuapp.com';

export default class Controller {
  constructor(passwordValue) {
    this.keyCrypt = passwordValue;
    this.wsURL = `wss://${pathToServer}/ws`;
    this.url = `https://${pathToServer}/`;
    this.crypton = new Crypton(passwordValue);
    this.lazyLoadActive = true;
  }

  async init() {
    this.messagesField = document.querySelector('.messages-field');
    // this.messanger = new Messanger(this.messagesField, this.crypton);
    this.messanger = new Messanger(this.messagesField);
    this.initWS();
    const response = await fetch(`${this.url}initmsg`);
    await response.text();
    this.lazyLoad();
  }

  initWS() {
    this.ws = new WebSocket(this.wsURL);
    this.ws.addEventListener('open', () => {
      console.log('connected');
    });

    this.ws.addEventListener('message', (evt) => {
      const messageObject = JSON.parse(evt.data);
      const messageElement = document.querySelector(`[data-id="${messageObject.id}"]`);

      if (messageElement !== null) {
        messageElement.classList.remove('loaded');
        return;
      }

      const deCrypt = this.crypton.deCrypt(messageObject.msg);

      if (deCrypt && deCrypt !== null) {
        messageObject.msg = deCrypt;
        currentMessages.push(messageObject);
        this.messanger.addMessage(messageObject, 'end');
        document.querySelector(`[data-id="${messageObject.id}"]`).classList.remove('loaded');
      }
    });

    this.ws.addEventListener('close', (evt) => {
      console.log('connection closed', evt);
    });

    this.ws.addEventListener('error', () => {
      console.log('error');
    });
  }

  sendMessage(message) {
    currentMessages.push(message);
    this.messanger.addMessage(message, 'end');

    if (this.ws.readyState === WebSocket.OPEN) {
      try {
        this.uploadMsg(message);
      } catch (e) {
        console.log('Oops, upload error...');
        console.log(e);
      }
    } else {
      this.ws = new WebSocket(this.wsURL);
      this.uploadMsg(message);
    }
  }

  uploadMsg(message) {
    const worker = new Worker();
    worker.addEventListener('message', (event) => {
      this.ws.send(JSON.stringify(event.data));
      worker.terminate();
    });

    worker.postMessage({
      file: message,
      keyCrypt: this.keyCrypt,
      workerCommand: 'enCrypt',
    });
  }

  async lazyLoad() {
    if (this.lazyLoadActive) {
      this.lazyLoadActive = false;
      const currentMessagesLength = currentMessages.length;

      const response = await fetch(`${this.url}msg/${currentMessagesLength}`);
      const responseBody = await response.json();
      let responceBodyLength = responseBody.length;

      const worker = new Worker();
      worker.addEventListener('message', (event) => {
        if (event.data.msg && event.data.msg !== null) {
          currentMessages.push(event.data);
          this.messanger.addMessage(event.data, 'start');
          document.querySelector(`[data-id="${event.data.id}"]`).classList.remove('loaded');
        }
        responceBodyLength -= 1;
        if (responceBodyLength === 0) {
          this.lazyLoadActive = true;
        }
      });

      worker.postMessage({
        file: responseBody,
        keyCrypt: this.keyCrypt,
        workerCommand: 'deCrypt',
      });
    }
  }

  changeFavorit(messageID, favoritValue) {
    const itemIndex = currentMessages.findIndex((item) => item.id === messageID);
    currentMessages[itemIndex].favorit = favoritValue;

    fetch(`${this.url}favorits`, {
      body: JSON.stringify({
        id: messageID,
        value: favoritValue,
      }),
      method: 'POST',
      // headers: this.contentTypeHeader, // not used and declareted!!!!!!!!!!!
    });
  }

  async exportHistory() {
    const filename = 'history.json';
    const response = await fetch(`${this.url}allmsg`);
    const responseBody = await response.json();
    const jsonString = JSON.stringify(responseBody);

    const linkToDownloadHistory = document.createElement('a');
    linkToDownloadHistory.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(jsonString)}`);
    linkToDownloadHistory.setAttribute('download', filename);
    linkToDownloadHistory.style.display = 'none';
    document.body.appendChild(linkToDownloadHistory);
    linkToDownloadHistory.click();
    document.body.removeChild(linkToDownloadHistory);
  }
}
