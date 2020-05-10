import validGeoposition from './validGeoposition.js';

export default class Popup {
  create() {
    this.popover = document.createElement('div');
    this.popover.className = 'popup hidden';
    this.popover.innerHTML = `
    <p class="popup-header"></p>
    <p class="popup-msg"></p>
    <input type="text" class="popup-inp hidden">
    <div class="popup-buttons">
      <div class="popup-ok button">OK</div>
      <div class="popup-cancel button hidden">Cancel</div>
    </div>
    `;
    document.body.appendChild(this.popover);

    this.popupHeader = document.querySelector('.popup-header');
    this.popupMessage = document.querySelector('.popup-msg');
    this.popupInputField = document.querySelector('.popup-inp');
    this.popupCancelButton = document.querySelector('.popup-cancel');
  }

  showPopup(type, message) {
    this.popover.classList.remove('hidden');
    this.popupHeader.innerText = 'Something went wrong...';
    this.popupMessage.innerText = message;
    if (type === 'get') {
      this.popupInputField.classList.remove('hidden');
      this.popupCancelButton.classList.remove('hidden');
    }
    this.popupInputField.addEventListener('keydown', () => {
      if (this.popupInputField.classList.contains('invalid-value')) {
        this.popupInputField.classList.remove('invalid-value');
      }
    });
  }

  validate() {
    if (validGeoposition(this.popupInputField.value)) {
      // this.popupInputField.style.borderColor = '#000000';
      if (this.popupInputField.classList.contains('invalid-value')) {
        this.popupInputField.classList.remove('invalid-value');
      }
      return true;
    }
    // this.popupInputField.style.borderColor = '#ff0000';
    this.popupInputField.classList.add('invalid-value');
    return false;
  }
}
