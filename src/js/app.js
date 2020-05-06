import Controller from './Controller.js';
import Popup from './Popup.js';
import Recorder from './Recorder.js';
import getGEO from './getGeoposition.js';
import Bot from './bot.js';

const uuid = require('uuid');

const elAddFile = document.querySelector('.add-file');
const popup = new Popup();
popup.create();

// let transferMsg = {};
let controller = null;
const elWindowStart = document.querySelector('.window');
const elLegends = document.querySelector('.legends');
const submitName = document.querySelector('#submit-name');
const funcBot = new Bot();

submitName.addEventListener('click', async () => {
  const inputName = document.querySelector('#inp-name');
  const keyCrypt = inputName.value;

  controller = new Controller(keyCrypt);
  controller.init();

  inputName.value = '';
  elLegends.classList.remove('hidden');
  elWindowStart.classList.add('hidden');
  // **************** rec AV *********************
  const recorder = new Recorder(popup, controller);
  recorder.init();
// **************** rec AV *********************
});

// **************** input file *********************
function loadFile(file) {
  console.log(file.name);
  const itemId = uuid.v4();
  const regExp = /[a-z]+/;
  const typeFile = file.type.match(regExp)[0];

  const fr = new FileReader();
  fr.readAsDataURL(file);

  fr.onload = () => {
    const objMessage = {
      id: itemId,
      type: typeFile,
      pin: false,
      favorit: false,
      name: file.name,
      msg: fr.result,
      dateTime: new Date(),
    };
    controller.sendMessage(objMessage);
  };
}

// ***************************** add file ****************************
const buttonSelectFile = document.querySelector('#button-select');
const elSelectFile = document.querySelector('#drop-file');
const elFavorits = document.querySelector('#favorits');

elAddFile.addEventListener('click', () => {
  buttonSelectFile.value = null;
  buttonSelectFile.dispatchEvent(new MouseEvent('click'));
});

elSelectFile.addEventListener('dragover', (event) => {
  event.preventDefault();
});

elSelectFile.addEventListener('drop', (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  for (const item of files) {
    loadFile(item);
  }
});

buttonSelectFile.addEventListener('change', (event) => {
  const files = Array.from(event.currentTarget.files);
  loadFile(files[0]);
});

elSelectFile.addEventListener('scroll', (event) => {
  if (event.target.scrollTop === 0) {
    controller.lazyLoad();
  }
});

elSelectFile.addEventListener('click', (event) => {
  const itemEl = event.target;
  if (itemEl.classList.contains('like')) {
    const parentEl = itemEl.closest('.item-message');
    if (itemEl.classList.contains('favorit')) {
      itemEl.classList.remove('favorit');
      parentEl.classList.add('no-favorit');
      controller.changeFavorit(parentEl.dataset.id, false);
      return;
    }
    itemEl.classList.add('favorit');
    parentEl.classList.remove('no-favorit');
    controller.changeFavorit(parentEl.dataset.id, true);
  }
});

elFavorits.addEventListener('click', () => {
  if (elFavorits.classList.contains('favorit')) {
    elFavorits.classList.remove('favorit');
    elFavorits.innerHTML = '';
    return;
  }
  elFavorits.classList.add('favorit');
  elFavorits.innerHTML = '<style>.no-favorit {display: none;}</style>';
});

// **************** input text *********************
const elInput = document.querySelector('#el-input');

elInput.addEventListener('keypress', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();

    const regExpBot = /^@chaos:/;
    // if (elInput.value.search(regExpBot) !== -1) {
    //   funcBot.funcBot(elInput.value);
    //   elInput.value = '';
    //   return;
    // }

    const messageFromUserObject = {
      id: uuid.v4(),
      type: 'textMsg',
      pin: false,
      favorit: false,
      msg: elInput.value,
      dateTime: new Date(),
    };
    controller.sendMessage(messageFromUserObject);
    const enteredMessage = elInput.value;
    elInput.value = '';

    if (enteredMessage.search(regExpBot) !== -1) {
      console.log('bot');
      const botAnswer = funcBot.getAnswer(enteredMessage);
      const messageFromBotObject = {
        id: uuid.v4(),
        type: 'botMsg',
        pin: false,
        favorit: false,
        msg: botAnswer,
        dateTime: new Date(),
      };
      controller.sendMessage(messageFromBotObject);
    }
  }
});

// **************** rec AV *********************
const elPopup = document.querySelector('.popup');
const elPopupInput = document.querySelector('.popup-inp');
const elPopupCancel = document.querySelector('.popup-cancel');
const elPopupOk = document.querySelector('.popup-ok');

// popup cancel
elPopupCancel.addEventListener('click', () => {
  elPopup.classList.add('hidden');
  return false;
});

// popup OK
elPopupOk.addEventListener('click', () => {
  if (elPopupInput.classList.contains('hidden')) {
    elPopup.classList.add('hidden');
  }
});

// **************** GEO *********************
const elGEO = document.querySelector('.geo-teg');

elGEO.addEventListener('click', async () => {
  const GEOteg = await getGEO(popup);
  elPopup.classList.add('hidden');
  console.log(GEOteg);
  const objMessage = {
    id: uuid.v4(),
    type: 'textMsg',
    pin: false,
    favorit: false,
    msg: GEOteg,
    dateTime: new Date(),
  };
  controller.sendMessage(objMessage);
});

// **************** export *********************
const elExport = document.querySelector('#export-history');

elExport.addEventListener(('click'), async () => {
  controller.exportHistory();
});
