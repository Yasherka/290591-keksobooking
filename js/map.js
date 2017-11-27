'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['flat', 'house', 'bungalo'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var TIMES = ['12:00', '13:00', '14:00'];

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
      value = ruTypes[i];
    }
  }
  return value;
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

  pinElement.style.left = (pin.location.x - 28) + 'px';
  pinElement.style.top = (pin.location.y - 62) + 'px';
  pinElement.querySelector('img').setAttribute('src', pin.author.avatar);

  return pinElement;
};

var createCardElement = function (array) {
  var cardElement = cardTemplate.cloneNode(true);
  var cardListElement = cardListTemplate.cloneNode();
  var fullList = cardElement.querySelector('.popup__features');

  cardElement.replaceChild(cardListElement, fullList);

  cardElement.querySelector('.popup__avatar').setAttribute('src', array.author.avatar);
  cardElement.querySelector('h3').textContent = array.offer.title;
  cardElement.querySelector('p small').textContent = array.offer.address;
  cardElement.querySelector('.popup__price').innerHTML = array.offer.price + ' &#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = compareType(array.offer.type, TYPES);
  cardElement.querySelector('p:nth-of-type(3)').textContent = array.offer.rooms + ' комнаты для ' + array.offer.guests + ' гостей';
  cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
  cardElement.querySelector('p:last-of-type').textContent = array.offer.description;

  var featuresList = array.offer.features;
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
  cardContainer.insertBefore(createCardElement(array[0]), cardPosition);
};

var proposes = [];
for (var i = 0; i < 8; i++) {
  proposes[i] = createPropose(i, TITLES, TYPES, TIMES, FEATURES);
}

document.querySelector('.map').classList.remove('map--faded');

renderSimilarElements(proposes);
