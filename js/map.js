'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.map = {
    cardContainer: document.querySelector('.map'),
    filtersBar: document.querySelector('.map__filters-container'),
    noticeFieldsets: document.querySelectorAll('.notice__form fieldset'),
    filtersValue: filters,

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
      pin.forEach(function (it) {
        it.parentNode.removeChild(it);
      });
    }
    window.map.hiddenPopup();
  };

  var filters = {
    type: null,
    price: null,
    rooms: null,
    guests: null,
    features: []
  };

  var typeFilter = window.map.filtersBar.querySelector('#housing-type');
  var priceFilter = window.map.filtersBar.querySelector('#housing-price');
  var roomsFilter = window.map.filtersBar.querySelector('#housing-rooms');
  var guestsFilter = window.map.filtersBar.querySelector('#housing-guests');
  var featuresFilter = window.map.filtersBar.querySelector('.map__filter-set');

  typeFilter.addEventListener('change', function (event) {
    var type = event.target.value;
    filters.type = type;
    window.util.debounse(updatePins);
  });

  priceFilter.addEventListener('change', function (event) {
    var price = event.target.value;
    filters.price = price;
    window.util.debounse(updatePins);
  });

  roomsFilter.addEventListener('change', function (event) {
    var rooms = event.target.value;
    filters.rooms = rooms;
    window.util.debounse(updatePins);
  });

  guestsFilter.addEventListener('change', function (event) {
    var guests = event.target.value;
    filters.guests = guests;
    window.util.debounse(updatePins);
  });


  featuresFilter.addEventListener('change', function () {
    window.util.debounse(updatePins);
  });

  var isInteger = function (num) {
    return !isNaN(parseInt(num, 10));
  };

  var filterType = function (type) {
    if (type !== 'any' && type !== null) {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.type === type;
      });
    }
    return window.util.filtered;
  };

  var filterPrice = function (price) {
    window.util.filtered = window.util.filtered.filter(function (it) {
      switch (price) {
        case 'low':
          return it.offer.price <= 10000;
        case 'middle':
          return it.offer.price >= 10000 && it.offer.price <= 50000;
        case 'high':
          return it.offer.price >= 50000;
      }
      return true;
    });
  };

  var filterRooms = function (rooms) {
    if (isInteger(rooms)) {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.rooms === parseInt(rooms, 10);
      });
    }
    return window.util.filtered;
  };

  var filterGuests = function (guests) {
    if (isInteger(guests)) {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.guests === parseInt(guests, 10);
      });
    }
    return window.util.filtered;
  };

  var filterFeatures = function (feature) {
    window.util.filtered = window.util.filtered.filter(function (it) {
      return it.offer.features.indexOf(feature) !== -1;
    });
    return window.util.filtered;
  };

  var filtratePins = function () {
    window.util.filtered = window.util.proposes.slice();

    filterType(filters.type);
    filterPrice(filters.price);
    filterRooms(filters.rooms);
    filterGuests(filters.guests);

    var features = featuresFilter.querySelectorAll('input[type="checkbox"]:checked');
    features.forEach(function (checkbox) {
      filterFeatures(checkbox.value);
    });
  };

  var updatePins = function () {
    filtratePins();
    cleanMap();
    window.pin.renderSimilarElements(window.util.filtered);
  };

})();
