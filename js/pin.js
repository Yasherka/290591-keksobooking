'use strict';

(function () {
  var POINTER_HEIGHT = 18;

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
  mainPin.addEventListener('mouseup', function () {
    window.form.setNoticeAddress();
  });

  similarListElement.addEventListener('click', onPinClick);

  window.pin = {
    deactivatePin: function () {
      similarListElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  };
})();
