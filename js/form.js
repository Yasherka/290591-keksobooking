'use strict';

(function () {
  var noticeForm = document.querySelector('.notice__form');
  var noticeTitle = noticeForm.querySelector('#title');
  var noticeAddress = noticeForm.querySelector('#address');
  var noticeType = noticeForm.querySelector('#type');
  var noticePrice = noticeForm.querySelector('#price');
  var noticeTimeIn = noticeForm.querySelector('#timein');
  var noticeTimeOut = noticeForm.querySelector('#timeout');
  var noticeRoomNumber = noticeForm.querySelector('#room_number');
  var noticeCapacity = noticeForm.querySelector('#capacity');
  var noticeSubmit = noticeForm.querySelector('.form__submit');
  var inputs = noticeForm.querySelectorAll('input');

  var setRecuired = function (element) {
    element.required = true;
  };

  var syncValues = function (element, index) {
    element.selectedIndex = index;
  };

  var syncValueWithMin = function (element, index) {
    var minPrices = [1000, 0, 5000, 10000];
    element.min = minPrices[index];
  };

  var setGuests = function (event) {
    var index = event.target.value;
    var capacities = noticeCapacity.options;

    switch (index) {
      case '1':
        window.util.disableElements(capacities);
        capacities[2].disabled = false;
        capacities.selectedIndex = 2;
        break;
      case '2':
        window.util.disableElements(capacities);
        capacities[1].disabled = false;
        capacities[2].disabled = false;
        capacities.selectedIndex = 1;
        break;
      case '3':
        window.util.disableElements(capacities);
        capacities[0].disabled = false;
        capacities[1].disabled = false;
        capacities[2].disabled = false;
        capacities.selectedIndex = 0;
        break;
      case '100':
        window.util.disableElements(capacities);
        capacities[3].disabled = false;
        capacities.selectedIndex = 3;
        break;
    }
  };

  var checkInputs = function () {
    var stopSubmit = false;

    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];

      if (input.checkValidity() === false) {
        input.style.borderColor = 'red';
        stopSubmit = true;
      }
    }
    return stopSubmit;
  };

  noticeForm.action = 'https://js.dump.academy/keksobooking';

  noticeTitle.setAttribute('minlength', '30');
  noticeTitle.setAttribute('maxlength', '100');
  setRecuired(noticeTitle);

  noticeAddress.readOnly = true;
  setRecuired(noticeAddress);
  window.form = {
    setNoticeAddress: function (location) {
      noticeAddress.value = 'x: ' + location.x + ', y: ' + location.y;
    }
  };

  noticePrice.type = 'number';
  noticePrice.value = 1000;
  noticePrice.min = 1000;
  noticePrice.max = 1000000;
  setRecuired(noticePrice);

  noticeCapacity.value = noticeRoomNumber.value;

  window.synchronizeFields(noticeTimeIn, noticeTimeOut, syncValues);
  window.synchronizeFields(noticeTimeOut, noticeTimeIn, syncValues);
  window.synchronizeFields(noticeType, noticePrice, syncValueWithMin);

  noticeRoomNumber.addEventListener('change', setGuests);

  noticeSubmit.addEventListener('click', function (event) {
    if (checkInputs()) {
      event.preventDefault();
    }
  });
})();
