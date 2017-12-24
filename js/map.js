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
    guests: null
    // features:
  };

  var typeFilter = window.map.filtersBar.querySelector('#housing-type');
  var priceFilter = window.map.filtersBar.querySelector('#housing-price');
  var roomsFilter = window.map.filtersBar.querySelector('#housing-rooms');
  var guestsFilter = window.map.filtersBar.querySelector('#housing-guests');

  typeFilter.addEventListener('change', function (event) {
    var type = event.target.value;
    filters.type = type;
    updatePins();
  });

  priceFilter.addEventListener('change', function (event) {
    var price = event.target.value;
    filters.price = price;
    updatePins();
  });

  roomsFilter.addEventListener('change', function (event) {
    var rooms = event.target.value;
    filters.rooms = rooms;
    updatePins();
  });

  guestsFilter.addEventListener('change', function (event) {
    var guests = event.target.value;
    filters.guests = guests;
    updatePins();
  });


  var isInteger = function (num) {
    return !isNaN(parseInt(num, 10));
  };

  var filterType = function (type) {
    if (type !== 'any') {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.type === type;
      });
    }
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
  };

  var filterGuests = function (guests) {
    if (isInteger(guests)) {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.guests === parseInt(guests, 10);
      });
    }
  };

  var filtratePins = function () {
    window.util.filtered = window.util.proposes.slice();

    filterType(filters.type);
    filterPrice(filters.price);
    filterRooms(filters.rooms);
    filterGuests(filters.guests);
  };

  var updatePins = function () {
    filtratePins();
    cleanMap();
    window.pin.renderSimilarElements(window.util.filtered);
  };

})();
