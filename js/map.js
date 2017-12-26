'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.map = {
    cardContainer: document.querySelector('.map'),
    filtersBar: document.querySelector('.map__filters-container'),
    noticeFieldsets: document.querySelectorAll('.notice__form fieldset'),

    onPopupEscPress: function (event) {
      if (event.keyCode === ESC_KEYCODE) {
        window.map.hiddenPopup();
        window.pin.deactivatePin();
      }
    },

    hiddenPopup: function () {
      if (document.querySelector('.popup')) {
        var popup = document.querySelector('.popup');
        popup.parentNode.removeChild(popup);
        document.removeEventListener('keydown', window.map.onPopupEscPress);
      }
    },

    onPopupCloseClick: function (event) {
      var target = event.target;

      if (target.className === 'popup__close') {
        window.map.hiddenPopup();
        window.pin.deactivatePin();
      }
    }
  };

  window.util.disableElements(window.map.noticeFieldsets);

  window.map.cardContainer.addEventListener('click', window.map.onPopupCloseClick);

  var cleanMap = function () {
    var pin = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pin) {
      pin.forEach(function (pinElement) {
        pinElement.parentNode.removeChild(pinElement);
      });
    }
    window.map.hiddenPopup();
  };

  var guestsFilter = window.map.filtersBar.querySelector('#housing-guests');
  var isValidGuest = function (propose) {
    var guestsFilterValue = guestsFilter.value;
    if (guestsFilterValue === 'any') {
      return true;
    }
    return propose.offer.guests >= parseInt(guestsFilterValue, 10);
  };

  var typeFilter = window.map.filtersBar.querySelector('#housing-type');
  var isValidTypes = function (propose) {
    var typeValue = typeFilter.value;
    if (typeValue === 'any') {
      return true;
    }
    return propose.offer.type === typeValue;
  };

  var roomsFilter = window.map.filtersBar.querySelector('#housing-rooms');
  var isValidRooms = function (propose) {
    var roomsFilterValue = roomsFilter.value;
    if (roomsFilterValue === 'any') {
      return true;
    }
    return propose.offer.rooms >= parseInt(roomsFilterValue, 10);
  };

  var priceFilter = window.map.filtersBar.querySelector('#housing-price');
  var isValidPrice = function (propose) {
    var priceFilterValue = priceFilter.value;
    switch (priceFilterValue) {
      case 'low':
        return propose.offer.price < 10000;
      case 'middle':
        return propose.offer.price >= 10000 && propose.offer.price < 50000;
      case 'high':
        return propose.offer.price >= 50000;
      default:
        return true;
    }
  };

  var featuresFilter = window.map.filtersBar.querySelector('.map__filter-set');
  var isValidFeaturesFilter = function (propose) {
    var featuresList = featuresFilter.querySelectorAll('input[type="checkbox"]:checked');

    return Array.prototype.every.call(featuresList, function (feature) {
      return propose.offer.features.indexOf(feature.value) !== -1;
    });
  };

  document.querySelector('.map__filters-container').addEventListener('change', function () {
    window.util.debounse(updatePins);
  });

  var filterAll = function (propose) {
    return isValidGuest(propose)
      && isValidTypes(propose)
      && isValidRooms(propose)
      && isValidPrice(propose)
      && isValidFeaturesFilter(propose);
  };

  var filtrateProposes = function () {
    var filtredProposes = window.util.proposes.slice();

    window.util.filtered = filtredProposes.filter(filterAll);
    return window.util.filtered;
  };

  var updatePins = function () {
    cleanMap();
    window.pin.renderSimilarElements(filtrateProposes());
  };

})();
