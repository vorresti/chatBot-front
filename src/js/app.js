import Controller from './Controller.js';
import Popup from './Popup.js';
import Recorder from './Recorder.js';
import Bot from './Bot.js';
import getGeoposition from './getGeoposition.js';

const uuid = require('uuid');

const bot = new Bot();

const popup = new Popup();
popup.create();

let controller = null;

// ******************** app init *************************************

const passwordWindow = document.querySelector('.password-window');
const passwordOkButton = document.querySelector('#password-ok-button');
const appWindow = document.querySelector('.app-window');

passwordOkButton.addEventListener('click', async () => {
  const passwordInputField = document.querySelector('#password-input-field');
  const passwordValue = passwordInputField.value;

  controller = new Controller(passwordValue);
  controller.init();

  passwordInputField.value = '';
  appWindow.classList.remove('hidden');
  passwordWindow.classList.add('hidden');

  const recorder = new Recorder(popup, controller);
  recorder.init();
});

// ******************** upload file *************************************

function upload(file) {
  const fileID = uuid.v4();
  const fileTypeRegExp = /[a-z]+/;
  const fileType = file.type.match(fileTypeRegExp)[0];

  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);

  fileReader.onload = () => {
    const message = {
      id: fileID,
      type: fileType,
      pin: false,
      favorit: false,
      name: file.name,
      msg: fileReader.result,
      dateTime: new Date(),
    };
    controller.sendMessage(message);
  };
}

// ******************** post files *************************************

const addFileButton = document.querySelector('.handle-add-file');
const inputTypeFile = document.querySelector('#input-type-file');
const messagesField = document.querySelector('.messages-field');

addFileButton.addEventListener('click', () => {
  inputTypeFile.value = null;
  inputTypeFile.dispatchEvent(new MouseEvent('click'));
});

messagesField.addEventListener('dragover', (event) => {
  event.preventDefault();
});

messagesField.addEventListener('drop', (event) => {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files);
  for (const file of files) {
    upload(file);
  }
});

inputTypeFile.addEventListener('change', (event) => {
  const files = Array.from(event.currentTarget.files);
  upload(files[0]);
});

// ***************** lazy-load scroll ************************************

messagesField.addEventListener('scroll', (event) => {
  if (event.target.scrollTop === 0) {
    controller.lazyLoad();
  }
});

// ***************** favorits controls ************************************

messagesField.addEventListener('click', (event) => {
  const selectedElement = event.target;
  if (selectedElement.classList.contains('favor')) {
    const parentElement = selectedElement.closest('.item-message');
    if (selectedElement.classList.contains('favorit')) {
      selectedElement.classList.remove('favorit');
      parentElement.classList.add('no-favorit');
      controller.changeFavorit(parentElement.dataset.id, false);
      return;
    }
    selectedElement.classList.add('favorit');
    parentElement.classList.remove('no-favorit');
    controller.changeFavorit(parentElement.dataset.id, true);
  }
});

const favoritsList = document.querySelector('#favorits');

favoritsList.addEventListener('click', () => {
  if (favoritsList.classList.contains('favorit')) {
    favoritsList.classList.remove('favorit');
    favoritsList.innerHTML = '';
    return;
  }
  favoritsList.classList.add('favorit');
  favoritsList.innerHTML = '<style>.no-favorit {display: none;}</style>';
});

// ***************** post text message ************************************

const inputMessageField = document.querySelector('#input-message-field');

inputMessageField.addEventListener('keypress', (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();

    const enteredMessage = inputMessageField.value;
    const regExpBot = /^@chaos:/;

    const message = {
      id: uuid.v4(),
      type: 'textMsg',
      pin: false,
      favorit: false,
      msg: enteredMessage,
      dateTime: new Date(),
    };
    controller.sendMessage(message);

    inputMessageField.value = '';

    if (enteredMessage.search(regExpBot) !== -1) {
      const botAnswer = bot.getAnswer(enteredMessage);
      const messageFromBot = {
        id: uuid.v4(),
        type: 'botMsg',
        pin: false,
        favorit: false,
        msg: botAnswer,
        dateTime: new Date(),
      };
      controller.sendMessage(messageFromBot);
    }
  }
});

// ***************** popup controls ************************************

const popupElement = document.querySelector('.popup');
const popupInputField = document.querySelector('.popup-inp');
const popupCancelButton = document.querySelector('.popup-cancel');
const popupOkButton = document.querySelector('.popup-ok');

popupCancelButton.addEventListener('click', () => {
  popupElement.classList.add('hidden');
  return false;
});

popupOkButton.addEventListener('click', () => {
  if (popupInputField.classList.contains('hidden')) {
    popupElement.classList.add('hidden');
  }
});

// ***************** post geoposition ************************************

const getGeopositionButton = document.querySelector('.geo-button');

getGeopositionButton.addEventListener('click', async () => {
  const coords = await getGeoposition(popup);
  popupElement.classList.add('hidden');
  const message = {
    id: uuid.v4(),
    type: 'textMsg',
    pin: false,
    favorit: false,
    msg: coords,
    dateTime: new Date(),
  };
  controller.sendMessage(message);
});

// **************** export history for preview to check app *********************

// it`s not for user, it`s for creating history file (../public/msg.json)
// and preview history for checking app

const exportHistoryButton = document.querySelector('#export-history');

exportHistoryButton.addEventListener(('click'), async () => {
  controller.exportHistory();
});
