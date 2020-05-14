/* eslint-disable class-methods-use-this */
import highlighter from 'highlight.js';
import getDate from './getDate.js';
import 'highlight.js/styles/github.css';

export default class Messanger {
  // constructor(messagesField, crypton) {
  //   this.messagesField = messagesField;
  //   this.crypton = crypton;// may be crypton is unnecessary here?????????????????????????????
  // }

  constructor(messagesField) {
    this.messagesField = messagesField;
  }

  addMessage(message, positionForInsert) {
    const currentMessage = message.msg;
    let messageMarkup = '';
    let cssClassList = 'item-message loaded no-favorit';

    switch (message.type) {
      case 'botMsg':
        messageMarkup = this.getTextMarkup(currentMessage);
        cssClassList = 'item-message loaded no-favorit bot';
        break;
      case 'textMsg':
        messageMarkup = this.getTextMarkup(currentMessage);
        break;
      case 'image':
        messageMarkup = this.getImgMarkup(currentMessage, message.name);
        break;
      case 'video':
        messageMarkup = this.getVideoMarkup(currentMessage, message.name);
        break;
      case 'audio':
        messageMarkup = this.getAudioMarkup(currentMessage, message.name);
        break;
      default:
        messageMarkup = this.getAppMarkup(currentMessage, message.name);
        break;
    }

    const newMessage = document.createElement('div');
    newMessage.className = cssClassList;
    newMessage.dataset.id = message.id;
    newMessage.innerHTML = `
    ${messageMarkup}
    <div class="footer-msg">
      <div class="favor av${message.favorit ? ' favorit' : ''}"></div>
      <div class="date-time">${getDate(message.dateTime)}</div>
    </div>
    `;
    if (positionForInsert === 'end') {
      this.messagesField.appendChild(newMessage);
      this.messagesField.scrollTo(0, newMessage.offsetTop);
    } else {
      this.messagesField.prepend(newMessage);
    }
  }

  getTextMarkup(message) {
    const regExpForLinks = /(https?:\/\/)[%:\w.\/-]+/;// eslint-disable-line no-useless-escape
    const regExpForCode = /```(.|\n)*?```/;
    let messageMarkup = message;

    if (message.search(regExpForLinks) !== -1) {
      messageMarkup = message.replace(regExpForLinks, `
      <a href="${message.match(regExpForLinks)[0]}">${message.match(regExpForLinks)[0]}</a>
    `);
    }

    if (message.search(regExpForCode) !== -1) {
      const codeFromMessage = message.match(regExpForCode)[0].replace(/```\n?/g, '');
      const highlightedCode = highlighter.highlightAuto(codeFromMessage.trim()).value;
      messageMarkup = message.replace(regExpForCode, `
      <pre><code>${highlightedCode}</code></pre>
      `);
    }
    return `
      ${messageMarkup}
    `;
  }

  getImgMarkup(message, name) {
    const imgMarkup = `
      <img src="${message}">
      <p class="name">${name}</p>
      <a class="download av" href="${message}" download="image"></a>
    `;
    return `
      ${imgMarkup}
    `;
  }

  getVideoMarkup(message, name) {
    // added from me
    let currentName = name;
    if (!name) {
      currentName = 'Recorded video';
    }
    // end
    const videoMarkup = `
      <video src="${message}" controls="controls"></video>
      <p class="name">${currentName}</p>
      <a class="download av" href="${message}" download="video"></a>
    `;
    return `
      ${videoMarkup}
    `;
  }

  getAudioMarkup(message, name) {
    // added from me
    let currentName = name;
    if (!name) {
      currentName = 'Recorded audio';
    }
    // end
    const audioMarkup = `
      <audio src="${message}" controls="controls"></audio>
      <p class="name">${currentName}</p>
      <a class="download av" href="${message}" download="audio"></a>
    `;
    return `
      ${audioMarkup}
    `;
  }

  getAppMarkup(message, name) {
    const appMarkup = `
      <div class="application"></div>
      <p class="name">${name}</p>
      <a class="download av" href="${message}" download="app"></a>
    `;
    return `
      ${appMarkup}
    `;
  }
}
