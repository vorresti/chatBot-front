export default function getGeoposition(popup) {
  console.log('Getting Geoposition...');
  const popupInputField = document.querySelector('.popup-inp');
  const popupCancelButton = document.querySelector('.popup-cancel');
  const popupOkButton = document.querySelector('.popup-ok');

  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}, ${longitude}`);
        }, (error) => {
          const msg = 'We were unable to determine your location, please give permission to use geolocation, or enter coordinates manually. Latitude and longitude must be entered separated by commas like this: (51.50851, −0.12572)';
          // callPopup(msg, popup);
          popup.showPopup('get', msg);
          popupOkButton.addEventListener('click', () => {
            console.log('Geolocation error code', error.code);
            if (popup.validate()) {
              // added from me to hire input and cancel in popup
              popupInputField.classList.add('hidden');// added from me..................
              popupCancelButton.classList.add('hidden');// added from me..................
              resolve(popupInputField.value);
            }
          });
          popupCancelButton.addEventListener('click', () => {
            // added from me to hire input and cancel in popup
            popupInputField.classList.add('hidden');// added from me..................
            popupCancelButton.classList.add('hidden');// added from me..................
            reject('cancel'); // eslint-disable-line prefer-promise-reject-errors
          });
        },
      );
    } else {
      const msg = 'Your browser (or hardware) don`t support geolocation. Latitude and longitude must be entered separated by commas like this: (51.50851, −0.12572)';
      // callPopup(msg, popup);
      popup.showPopup('get', msg);

      popupOkButton.addEventListener('click', () => {
        // console.log('GEO ok');
        if (popup.validate()) {
          resolve(popupInputField.value);
        }
      });
      popupCancelButton.addEventListener('click', () => {
        reject('cancel'); // eslint-disable-line prefer-promise-reject-errors
      });
    }
  });
}
