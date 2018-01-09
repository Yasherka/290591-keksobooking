'use strict';

(function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var apartmentTypes = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var createCardElement = function (propose) {
    var cardElement = cardTemplate.cloneNode(true);
    var fullList = cardElement.querySelector('.popup__features');

    var cardListElement = cardTemplate.querySelector('.popup__features').cloneNode(false);

    cardElement.querySelector('.popup__avatar').src = propose.author.avatar;
    cardElement.querySelector('h3').textContent = propose.offer.title;
    cardElement.querySelector('p small').textContent = propose.offer.address;
    cardElement.querySelector('.popup__price').innerHTML = propose.offer.price + ' &#x20bd;/ночь';
    cardElement.querySelector('h4').textContent = apartmentTypes[propose.offer.type];
    cardElement.querySelector('p:nth-of-type(3)').textContent = propose.offer.rooms + ' комнаты для ' + propose.offer.guests + ' гостей';
    cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + propose.offer.checkin + ', выезд до ' + propose.offer.checkout;
    cardElement.querySelector('p:last-of-type').textContent = propose.offer.description;

    propose.offer.features.forEach(function (feature) {
      cardListElement.innerHTML += '<li class="feature feature--' + feature + '"></li>';
    });
    cardElement.replaceChild(cardListElement, fullList);

    return cardElement;
  };

  window.showCard = function (propose) {
    window.map.cardContainer.insertBefore(createCardElement(propose), window.map.filtersBar);
  };

})();
