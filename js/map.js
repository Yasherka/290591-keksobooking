'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = ['flat', 'house', 'bungalo'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var TIMES = ['12:00', '13:00', '14:00'];

var getRandInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

var getRandElementOfArray = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

var addZero = function (num, size) {
  var n = num + '';
  if (n.length < size) {
    n = '0' + n;
    return n;
  } else {
    return n;
  }
};

var shuffleArray = function (array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

var createIndexes = function (length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(i);
  }
  shuffleArray(arr);
  return arr;
};

var getRandLengthArray = function (array) {
  var newArray = [];
  var randLength = getRandInteger(1, array.length);
  var Indexes = createIndexes(randLength);

  for (var i = 0; i < randLength; i++) {
    newArray[i] = array[Indexes[i]];
  }
  return newArray;
};

var createPropose = function (index, title, type, time, features) {
  var locationX = getRandInteger(300, 900);
  var locationY = getRandInteger(100, 500);

  var propose = {
    author: {
      avatar: 'img/avatars/user' + addZero(index + 1, 2) + '.png'
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

var avatarIndexes = createIndexes(7);

var proposes = [];
for (var i = 0; i < 8; i++) {
  proposes[i] = createPropose(avatarIndexes[i], TITLES, TYPES, TIMES, FEATURES);
}
