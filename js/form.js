'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var TITLE_MIN = 30;
  var TITLE_MAX = 100;
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;

  var TIMES = ['12:00', '13:00', '14:00'];
  var TYPES = ['flat', 'bungalo', 'house', 'palace'];
  var PRICES = [1000, 0, 5000, 10000];
  var ROOMS = ['1', '2', '3', '100'];
  var CAPACITY_VALUES = ['1', '2', '3', '0'];

  var GuestIndex = {
    ONE: 2,
    TWO: 1,
    THREE: 0,
    NONE: 3
  };
  var RoomNumber = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    MANY: '100'
  };

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
    var number = noticeRoomNumber.value;
    var capacities = Array.from(noticeCapacity.options);

    window.util.disableElements(capacities);

    switch (number) {
      case RoomNumber.ONE:
        capacities[GuestIndex.ONE].disabled = false;
        capacities.selectedIndex = GuestIndex.ONE;
        break;
      case RoomNumber.TWO:
        capacities[GuestIndex.ONE].disabled = false;
        capacities[GuestIndex.TWO].disabled = false;
        capacities.selectedIndex = GuestIndex.TWO;
        break;
      case RoomNumber.THREE:
        capacities[GuestIndex.ONE].disabled = false;
        capacities[GuestIndex.TWO].disabled = false;
        capacities[GuestIndex.THREE].disabled = false;
        capacities.selectedIndex = GuestIndex.THREE;
        break;
      case RoomNumber.MANY:
        capacities[GuestIndex.NONE].disabled = false;
        capacities.selectedIndex = GuestIndex.NONE;
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

  noticeForm.action = URL;

  noticeTitle.minLength = TITLE_MIN;
  noticeTitle.maxLength = TITLE_MAX;
  setRecuired(noticeTitle);

  noticeAddress.readOnly = true;
  setRecuired(noticeAddress);
  window.form = {
    setNoticeAddress: function (location) {
      noticeAddress.value = 'x: ' + location.x + ', y: ' + location.y;
    }
  };

  noticePrice.type = 'number';
  noticePrice.value = PRICE_MIN;
  noticePrice.min = PRICE_MIN;
  noticePrice.max = PRICE_MAX;
  setRecuired(noticePrice);

  noticeCapacity.value = noticeRoomNumber.value;
  setGuests();

  window.synchronizeFields(noticeTimeIn, noticeTimeOut, TIMES, TIMES, syncValues);
  window.synchronizeFields(noticeTimeOut, noticeTimeIn, TIMES, TIMES, syncValues);
  window.synchronizeFields(noticeType, noticePrice, TYPES, PRICES, syncValueWithMin);
  window.synchronizeFields(noticeRoomNumber, noticeCapacity, ROOMS, CAPACITY_VALUES, syncValues);

  noticeRoomNumber.addEventListener('change', setGuests);

  noticeForm.addEventListener('submit', function (event) {
    if (checkInputs()) {
      event.preventDefault();
    } else {
      window.backend.save(new FormData(noticeForm), function () {
        var address = noticeAddress.value;
        noticeForm.reset();

        var images = window.photoPreview.querySelectorAll('img');
        if (images) {
          images.forEach(function (image) {
            image.remove();
          });
        }

        noticeAddress.value = address;
        noticePrice.value = PRICE_MIN;
        noticeCapacity.value = noticeRoomNumber.value;
        setGuests();
      }, window.util.errorHandler);
      event.preventDefault();
    }
  });
})();
