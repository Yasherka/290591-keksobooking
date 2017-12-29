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
    var pinHeight = pinElement.querySelector('img').height;

    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = (pin.location.y - pinHeight / 2 - POINTER_HEIGHT) + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.tabindex = 0;
    pinElement.dataset.index = index;

    return pinElement;
  };

  var renderSimilarElements = function (array) {
    var takeNumber = array.length > 5 ? 5 : array.length;
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < takeNumber; i++) {
      fragment.appendChild(createPinElement(array[i], i));
    }
    similarListElement.appendChild(fragment);
  };

  var getData = function (data) {
    window.util.proposes = data;
    window.pin.renderSimilarElements(window.util.proposes);
  };

  var onPinClick = function (event) {
    var target = event.target;

    if (target.parentNode.className === 'map__pin') {
      var pin = target.parentNode;

      if (similarListElement.querySelector('.map__pin--active')) {
        window.pin.deactivate();
      }
      pin.classList.add('map__pin--active');
      var index = Number(pin.dataset.index);

      window.map.hiddenPopup();
      window.showCard(index);
      document.addEventListener('keydown', window.map.onPopupEscPress);
    }
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
    deactivate: function () {
      similarListElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
    },
    renderSimilarElements: renderSimilarElements
  };
})();
