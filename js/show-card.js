'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cardListTemplate = document.querySelector('template').content.querySelector('.map__card .popup__features');

  var compareType = function (value) {
    if (value === 'flat') {
      return 'Квартира';
    } else if (value === 'house') {
      return 'Дом';
    } else {
      return 'Бунгало';
    }
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
    cardElement.querySelector('h4').textContent = compareType(propose.offer.type);
    cardElement.querySelector('p:nth-of-type(3)').textContent = propose.offer.rooms + ' комнаты для ' + propose.offer.guests + ' гостей';
    cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + propose.offer.checkin + ', выезд до ' + propose.offer.checkout;
    cardElement.querySelector('p:last-of-type').textContent = propose.offer.description;

    var featuresList = propose.offer.features;
    for (var i = 0; i < featuresList.length; i++) {
      cardElement.querySelector('.popup__features').innerHTML += '<li class=\'feature feature--' + featuresList[i] + '\'></li>';
    }
    return cardElement;
  };

  window.showCard = function (index) {
    var card;

    card = window.util.filtered.length === 0 ? createCardElement(window.util.proposes[index]) : createCardElement(window.util.filtered[index]);

    window.map.cardContainer.insertBefore(card, window.map.filtersBar);
  };

})();
