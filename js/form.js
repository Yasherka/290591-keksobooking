'use strict';

(function () {
  var TIMES = ['12:00', '13:00', '14:00'];
  var TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var MIN_PRICES = [1000, 0, 5000, 10000];

  var noticeForm = document.querySelector('.notice__form');
  var noticeTitle = noticeForm.querySelector('#title');
  var noticeAddress = noticeForm.querySelector('#address');
  var noticeType = noticeForm.querySelector('#type');
  var noticePrice = noticeForm.querySelector('#price');
  var noticeTimeIn = noticeForm.querySelector('#timein');
  var noticeTimeOut = noticeForm.querySelector('#timeout');
  var noticeRoomNumber = noticeForm.querySelector('#room_number');
  var noticeCapacity = noticeForm.querySelector('#capacity');
  var inputs = noticeForm.querySelectorAll('input');

  var setRecuired = function (element) {
    element.required = true;
  };

  var syncValues = function (element, value) {
    element.value = value;
  };

  var syncValueWithMin = function (element, value) {
    element.min = value;
  };

  var setGuests = function () {
    var index = noticeRoomNumber.value;
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

  noticeTitle.minLength = 30;
  noticeTitle.maxLength = 100;
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
  setGuests();

  window.synchronizeFields(noticeTimeIn, noticeTimeOut, TIMES, TIMES, syncValues);
  window.synchronizeFields(noticeTimeOut, noticeTimeIn, TIMES, TIMES, syncValues);
  window.synchronizeFields(noticeType, noticePrice, TYPES, MIN_PRICES, syncValueWithMin);

  noticeRoomNumber.addEventListener('change', setGuests);

  noticeForm.addEventListener('submit', function (event) {
    if (checkInputs()) {
      event.preventDefault();
    } else {
      window.backend.save(new FormData(noticeForm), function () {
        var address = noticeAddress.value;
        noticeForm.reset();

        noticeAddress.value = address;
        noticePrice.value = 1000;
        noticeCapacity.value = noticeRoomNumber.value;
        setGuests();
      }, window.util.errorHandler);
      event.preventDefault();
    }
  });
})();
