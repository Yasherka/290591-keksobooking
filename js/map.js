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

var getRandElementOfArray = function (array) {
  var rand = Math.floor(Math.random() * array.length);
  return array[rand];
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

var createCardElement = function (propose) {
  var cardElement = cardTemplate.cloneNode(true);
  var cardListElement = cardListTemplate.cloneNode();
  var fullList = cardElement.querySelector('.popup__features');

  cardElement.replaceChild(cardListElement, fullList);

  cardElement.querySelector('.popup__avatar').setAttribute('src', propose.author.avatar);
  cardElement.querySelector('h3').textContent = propose.offer.title;
  cardElement.querySelector('p small').textContent = propose.offer.address;
  cardElement.querySelector('.popup__price').innerHTML = propose.offer.price + ' &#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = compareType(propose.offer.type, TYPES);
  cardElement.querySelector('p:nth-of-type(3)').textContent = propose.offer.rooms + ' комнаты для ' + propose.offer.guests + ' гостей';
  cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + propose.offer.checkin + ', выезд до ' + propose.offer.checkout;
  cardElement.querySelector('p:last-of-type').textContent = propose.offer.description;

  var featuresList = propose.offer.features;
  for (var i = 0; i < featuresList.length; i++) {
    cardElement.querySelector('.popup__features').innerHTML += '<li class=\'feature feature--' + featuresList[i] + '\'></li>';
  }
  return cardElement;
};

var renderSimilarElements = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createPinElement(array[i], i));
  }
  similarListElement.appendChild(fragment);
};

var renderElementBefore = function (element, container, position) {
  container.insertBefore(createCardElement(element), position);
};

var disableElements = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].setAttribute('disabled', 'disabled');
  }
};

var enableElements = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].removeAttribute('disabled');
  }
};

var onMainPinClick = function () {
  var noticeForm = document.querySelector('.notice__form');

  cardContainer.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  enableElements(noticeFieldsets);

  for (var i = 0; i < pinsList.length; i++) {
    pinsList[i].classList.remove('hidden');
  }
  mainPin.removeEventListener('click', onMainPinClick);
};

var onPopupEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    hiddenPopup();
    deactivatePin();
  }
};

var hiddenPopup = function () {
  if (document.querySelector('.popup')) {
    var popup = document.querySelector('.popup');
    popup.parentNode.removeChild(popup);
    document.removeEventListener('keydown', onPopupEscPress);
  }
};

var deactivatePin = function () {
  similarListElement.querySelector('.map__pin--active').classList.remove('map__pin--active');
};

var onPinClick = function (event) {
  var target = event.target;

  if (target.parentNode.className === 'map__pin') {
    var pin = target.parentNode;

    if (similarListElement.querySelector('.map__pin--active')) {
      deactivatePin();
    }
    pin.classList.add('map__pin--active');
    var index = Number(pin.dataset.index);

    hiddenPopup();
    renderElementBefore(proposes[index], cardContainer, cardPosition);
    document.addEventListener('keydown', onPopupEscPress);
  }
};

var onPopupCloseClick = function (event) {
  var target = event.target;

  if (target.className === 'popup__close') {
    hiddenPopup();
    deactivatePin();
  }
};

var setRecuired = function (element) {
  element.required = true;
};

var syncSelect = function (secondSelect) {
  var index = event.target.selectedIndex;
  secondSelect.selectedIndex = index;
};

var setMinPrice = function (event) {
  var index = event.target.selectedIndex;
  var minPrices = [1000, 0, 5000, 10000];

  noticePrice.min = minPrices[index];

  return noticePrice.min;
};

var setGuests = function (event) {
  var index = event.target.value;
  var capacities = noticeCapacity.options;

  switch (index) {
    case '1':
      disableElements(capacities);
      capacities[2].disabled = false;
      capacities.selectedIndex = 2;
      break;
    case '2':
      disableElements(capacities);
      capacities[1].disabled = false;
      capacities[2].disabled = false;
      capacities.selectedIndex = 1;
      break;
    case '3':
      disableElements(capacities);
      capacities[0].disabled = false;
      capacities[1].disabled = false;
      capacities[2].disabled = false;
      capacities.selectedIndex = 0;
      break;
    case '100':
      disableElements(capacities);
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

var noticeFieldsets = document.querySelectorAll('.notice__form fieldset');
disableElements(noticeFieldsets);

var proposes = [];
for (var i = 0; i < 8; i++) {
  proposes[i] = createPropose(i, TITLES, TYPES, TIMES, FEATURES);
}

renderSimilarElements(proposes);

var pinsList = document.querySelectorAll('.map__pin');
var mainPin = document.querySelector('.map__pin--main');

mainPin.addEventListener('click', onMainPinClick);
similarListElement.addEventListener('click', onPinClick);
cardContainer.addEventListener('click', onPopupCloseClick);

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

noticeForm.action = 'https://js.dump.academy/keksobooking';

noticeTitle.minlength = 30;
noticeTitle.maxlength = 100;
setRecuired(noticeTitle);

noticeAddress.readOnly = true;
mainPin.addEventListener('mouseup', function () {
  noticeAddress.value = 'address';
});
setRecuired(noticeAddress);

noticePrice.type = 'number';
noticePrice.value = 1000;
noticePrice.min = 1000;
noticePrice.max = 1000000;
setRecuired(noticePrice);

noticeCapacity.value = noticeRoomNumber.value;

noticeTimeIn.addEventListener('change', function () {
  syncSelect(noticeTimeOut);
});

noticeTimeOut.addEventListener('change', function () {
  syncSelect(noticeTimeIn);
});

noticeType.addEventListener('change', setMinPrice);

noticeRoomNumber.addEventListener('change', setGuests);

noticeSubmit.addEventListener('click', function (event) {
  if (checkInputs()) {
    event.preventDefault();
  }
});
