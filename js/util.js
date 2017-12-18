'use strict';

(function () {
  window.util = {
    disableElements: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i].setAttribute('disabled', 'disabled');
      }
    },
    enableElements: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i].removeAttribute('disabled');
      }
    }
  };
})();
