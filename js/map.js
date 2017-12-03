'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['flat', 'house', 'bungalo'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var TIMES = ['12:00', '13:00', '14:00'];

var POINTER_HEIGHT = 18;
var ESC_KEYCODE = 27;

var similarListElement = document.querySelector('.map__pins');
var similarPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var cardContainer = document.querySelector('.map');
var cardPosition = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
var cardListTemplate = document.querySelector('template').content.querySelector('.map__card .popup__features');

var getRandInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

var getRandElementOfArray = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

var getRandLengthArray = function (array) {
  var newArray = [];
  var randLength = getRandInteger(1, array.length);

  for (var i = 0; i < randLength; i++) {
    newArray[i] = array[i];
  }
  return newArray;
};

var compareType = function (value, array) {
  var ruTypes = ['Квартира', 'Дом', 'Бунгало'];
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return ruTypes[i];
    }
  }
  return ruTypes[i];
};

var createPropose = function (index, title, type, time, features) {
  var locationX = getRandInteger(300, 900);
  var locationY = getRandInteger(100, 500);

  var propose = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    offer: {
      title: title[index],
      address: locationX + ', ' + locationY,
      price: getRandInteger(1000, 1000000),
      type: getRandElementOfArray(type),
      rooms: getRandInteger(1, 5),
      guests: getRandInteger(1, 9),
      checkin: getRandElementOfArray(time),
      checkout: getRandElementOfArray(time),
      features: getRandLengthArray(features),
      description: '',
      photos: []
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return propose;
};

var createPinElement = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  var pinHeight = pinElement.querySelector('img').getAttribute('height');

  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = (pin.location.y - pinHeight / 2 - POINTER_HEIGHT) + 'px';
  pinElement.querySelector('img').setAttribute('src', pin.author.avatar);
  pinElement.style.display = 'none';

  return pinElement;
};

var createCardElement = function (element) {
  var cardElement = cardTemplate.cloneNode(true);
  var cardListElement = cardListTemplate.cloneNode();
  var fullList = cardElement.querySelector('.popup__features');

  cardElement.replaceChild(cardListElement, fullList);

  cardElement.querySelector('.popup__avatar').setAttribute('src', element.author.avatar);
  cardElement.querySelector('h3').textContent = element.offer.title;
  cardElement.querySelector('p small').textContent = element.offer.address;
  cardElement.querySelector('.popup__price').innerHTML = element.offer.price + ' &#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = compareType(element.offer.type, TYPES);
  cardElement.querySelector('p:nth-of-type(3)').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
  cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
  cardElement.querySelector('p:last-of-type').textContent = element.offer.description;
  cardElement.style.display = 'none';

  var featuresList = element.offer.features;
  for (var i = 0; i < featuresList.length; i++) {
    cardElement.querySelector('.popup__features').innerHTML += '<li class=\'feature feature--' + featuresList[i] + '\'></li>';
  }
  return cardElement;
};

var renderSimilarElements = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createPinElement(array[i]));
  }

  similarListElement.appendChild(fragment);
};

var renderElementBefore = function (element, container, position) {
  for (var i = 0; i < element.length; i++) {
    container.insertBefore(createCardElement(element[i]), position);
  }
};

var disableElement = function (element) {
  for (var i = 0; i < element.length; i++) {
    element[i].setAttribute('disabled', 'disabled');
  }
};

var enableElement = function (element) {
  for (var i = 0; i < element.length; i++) {
    element[i].removeAttribute('disabled');
  }
};

var switchPin = function (pins, popups) {
  var pinsArray = Array.prototype.slice.call(pins);
  var popupsArray = Array.prototype.slice.call(popups);

  for (var i = 0; i < pinsArray.length; i++) {
    pinsList[i].setAttribute('tabindex', '0');

    (function () {
      var k = i;
      pinsArray[k].addEventListener('click', function () {
        if (pinsArray[k].classList.contains('map__pin--active')) {
          return;
        } else {
          hidePrevios(pinsArray, popupsArray);
          showNew(pinsArray, popupsArray, k);
        }
      });
    })();
  }
};

var hidePrevios = function (pins, popups) {
  for (var j = 0; j < popups.length; j++) {
    var index = pins[j];
    if (index.classList.contains('map__pin--active')) {
      index.classList.remove('map__pin--active');
      if (j > 0) {
        popups[j - 1].style.display = 'none';
      }
    }
  }
};

var showNew = function (pins, popups, k) {
  pins[k].classList.add('map__pin--active');
  if (k > 0) {
    popups[k - 1].style.display = 'block';
    pressEsc(popups[k - 1], pins[k]);
  }
};

var pressEsc = function (popup, pin) {
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      popup.style.display = 'none';
      pin.classList.remove('map__pin--active');
    }
  });
};

var activateMap = function (mainPin, pins) {
  var noticeForm = document.querySelector('.notice__form');

  mainPin.addEventListener('mouseup', function () {
    cardContainer.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    enableElement(noticeFieldset);

    for (var i = 0; i < pinsList.length; i++) {
      pins[i].style.display = 'block';
    }
  });
};

var closePopup = function (popupClose, pins) {
  var popupCloseArray = Array.prototype.slice.call(popupClose);

  for (var i = 0; i < popupCloseArray.length; i++) {
    popupCloseArray[i].setAttribute('tabindex', '0');

    (function () {
      var j = i;
      popupCloseArray[j].addEventListener('click', function () {
        var parent = popupCloseArray[j].parentNode;
        parent.style.display = 'none';
        pins[j + 1].classList.remove('map__pin--active');
      });
    })();
  }
};

var noticeFieldset = document.querySelectorAll('.notice__form fieldset');
disableElement(noticeFieldset);

var proposes = [];
for (var i = 0; i < 8; i++) {
  proposes[i] = createPropose(i, TITLES, TYPES, TIMES, FEATURES);
}

renderSimilarElements(proposes);
renderElementBefore(proposes, cardContainer, cardPosition);

var mainPin = document.querySelector('.map__pin--main');
var pinsList = document.querySelectorAll('.map__pin');
var popupList = document.querySelectorAll('.popup');
var popupClose = document.querySelectorAll('.popup__close');

switchPin(pinsList, popupList);
activateMap(mainPin, pinsList);
closePopup(popupClose, pinsList);
