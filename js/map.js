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
    typeHandler: function () {},
    priceHandler: function () {},
    roomsHandler: function () {},
    guestsHandler: function () {}
    // features:
  };

  var typeFilter = window.map.filtersBar.querySelector('#housing-type');
  var priceFilter = window.map.filtersBar.querySelector('#housing-price');
  var roomsFilter = window.map.filtersBar.querySelector('#housing-rooms');
  var guestsFilter = window.map.filtersBar.querySelector('#housing-guests');

  window.map.filtersBar.addEventListener('change', function () {
    window.util.filtered = window.util.proposes.slice();
  }, true);

  typeFilter.addEventListener('change', function (event) {
    var type = event.target.value;
    filters.typeHandler(type);
  });

  priceFilter.addEventListener('change', function (event) {
    var price = event.target.value;
    filters.priceHandler(price);
  });

  roomsFilter.addEventListener('change', function (event) {
    var room = event.target.value;
    filters.roomsHandler(Number(room));
  });

  guestsFilter.addEventListener('change', function (event) {
    var guests = event.target.value;
    filters.guestsHandler(Number(guests));
  });

  filters.typeHandler = function (type) {
    if (type !== 'any') {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.type === type;
      });
    }
    updatePins();
  };

  filters.priceHandler = function (price) {
    window.util.filtered = window.util.filtered.filter(function (it) {
      switch (price) {
        case 'low':
          return it.offer.price <= 10000;
        case 'middle':
          return it.offer.price >= 10000 && it.offer.price <= 50000;
        case 'high':
          return it.offer.price >= 50000;
      }
      return false;
    });
    updatePins();
  };

  filters.roomsHandler = function (rooms) {
    if (rooms !== 'any') {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.rooms === rooms;
      });
    }
    updatePins();
  };

  filters.guestsHandler = function (guests) {
    if (guests !== 'any') {
      window.util.filtered = window.util.filtered.filter(function (it) {
        return it.offer.guests === guests;
      });
    }
    updatePins();
  };


  var updatePins = function () {
    cleanMap();
    window.pin.renderSimilarElements(window.util.filtered);
  };

})();
