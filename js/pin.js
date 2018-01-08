'use strict';

(function () {
  var LIMIT_TOP = 100;
  var LIMIT_BOTTOM = 500;
  var POINTER_HEIGHT = 18;
  var POINTER_WIDTH = 10;
  var MAIN_POINTER_HEIGHT = 22;
  var MAX_PIN_COUNT = 5;

  var similarListElement = document.querySelector('.map__pins');
  var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mainPin = document.querySelector('.map__pin--main');

  var createPinElement = function (pin) {
    var pinElement = similarPinTemplate.cloneNode(true);
    var pinHeight = pinElement.querySelector('img').height;

    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = (pin.location.y - pinHeight / 2 - POINTER_HEIGHT) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.tabindex = 0;

    var onPinClick = function () {
      window.pin.deactivate();

      pinElement.classList.add('map__pin--active');
      window.map.hiddenPopup();
      window.showCard(pin);
      document.addEventListener('keydown', window.map.onPopupEscPress);
    };

    pinElement.addEventListener('click', onPinClick);

    return pinElement;
  };

  var renderSimilarElements = function (elements) {
    var takeNumber = elements.length > MAX_PIN_COUNT ? MAX_PIN_COUNT : elements.length;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(createPinElement(elements[i]));
    }
    similarListElement.appendChild(fragment);
  };

  var getData = function (data) {
    window.util.proposes = data;
    renderSimilarElements(window.util.proposes);
  };

  var onMainPinClick = function () {
    var noticeForm = document.querySelector('.notice__form');

    window.backend.load(getData, window.util.errorHandler);

    window.map.cardContainer.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    window.util.enableElements(window.map.noticeFieldsets);

    mainPin.removeEventListener('click', onMainPinClick);
  };

  mainPin.addEventListener('click', onMainPinClick);

  var mainPinHeight = mainPin.querySelector('img').height;
  var limits = {
    top: LIMIT_TOP - mainPinHeight / 2 - MAIN_POINTER_HEIGHT,
    bottom: LIMIT_BOTTOM - mainPinHeight / 2 - MAIN_POINTER_HEIGHT
  };

  var startCoords = {
    x: 0,
    y: 0
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var newCoords = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    if (newCoords.y < limits.top) {
      newCoords.y = limits.top;
    } else if (newCoords.y > limits.bottom) {
      newCoords.y = limits.bottom;
    }

    mainPin.style.left = newCoords.x + 'px';
    mainPin.style.top = newCoords.y + 'px';
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    var pinLocation = {
      x: mainPin.offsetLeft - POINTER_WIDTH / 2,
      y: mainPin.offsetTop + mainPinHeight / 2 + MAIN_POINTER_HEIGHT
    };
    window.form.setNoticeAddress(pinLocation);
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.pin = {
    deactivate: function () {
      var activePin = similarListElement.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    },
    renderSimilarElements: renderSimilarElements
  };
})();
