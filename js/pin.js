'use strict';

(function () {
  var POINTER_HEIGHT = 18;
  var MAIN_POINTER_HEIGHT = 22;
  var POINTER_WIDTH = 10;

  var similarListElement = document.querySelector('.map__pins');
  var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mainPin = document.querySelector('.map__pin--main');

  var createPinElement = function (pin, index) {
    var pinElement = similarPinTemplate.cloneNode(true);
    var pinHeight = pinElement.querySelector('img').getAttribute('height');

    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = (pin.location.y - pinHeight / 2 - POINTER_HEIGHT) + 'px';
    pinElement.querySelector('img').setAttribute('src', pin.author.avatar);
    pinElement.classList.add('hidden');
    pinElement.setAttribute('tabindex', '0');
    pinElement.dataset.index = index;

    return pinElement;
  };

  var renderSimilarElements = function (array) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(createPinElement(array[i], i));
    }
    similarListElement.appendChild(fragment);
  };

  var onPinClick = function (event) {
    var target = event.target;

    if (target.parentNode.className === 'map__pin') {
      var pin = target.parentNode;

      if (similarListElement.querySelector('.map__pin--active')) {
        window.pin.deactivatePin();
      }
      pin.classList.add('map__pin--active');
      var index = Number(pin.dataset.index);

      window.map.hiddenPopup();
      window.util.renderElementBefore(window.card.createCardElement(window.data.proposes[index]), window.map.cardContainer, window.map.cardPosition);
      document.addEventListener('keydown', window.map.onPopupEscPress);
    }
  };

  var onMainPinClick = function () {
    var noticeForm = document.querySelector('.notice__form');

    window.map.cardContainer.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    window.util.enableElements(window.map.noticeFieldsets);

    for (var i = 0; i < pinsList.length; i++) {
      pinsList[i].classList.remove('hidden');
    }
    mainPin.removeEventListener('click', onMainPinClick);
  };

  renderSimilarElements(window.data.proposes);

  var pinsList = document.querySelectorAll('.map__pin');

  mainPin.addEventListener('click', onMainPinClick);

  var mainPinHeight = mainPin.querySelector('img').height;
  var limits = {
    top: 100 - mainPinHeight / 2 - MAIN_POINTER_HEIGHT,
    bottom: 500 - mainPinHeight / 2 - MAIN_POINTER_HEIGHT
  };

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
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

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  similarListElement.addEventListener('click', onPinClick);

  window.pin = {
    deactivatePin: function () {
      similarListElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  };
})();
