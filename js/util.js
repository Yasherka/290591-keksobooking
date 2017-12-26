'use strict';

(function () {
  var lastTimeout;

  window.util = {
    proposes: [],
    filtered: [],
    disableElements: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i].setAttribute('disabled', 'disabled');
      }
    },
    enableElements: function (array) {
      for (var i = 0; i < array.length; i++) {
        array[i].removeAttribute('disabled');
      }
    },
    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.style = 'z-index: 100; margin: 0 auto; margin-left: -160px; padding: 10px; text-align: center; background-color: rgba(255, 86, 53, 0.7); width: 300px; border-radius: 10px';
      node.style.position = 'fixed';
      node.style.top = '73%';
      node.style.left = '50%';
      node.style.fontSize = '22px';
      node.style.fontWeight = 'bold';
      node.style.color = 'white';
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);
    },
    debounse: function (func) {
      var DEBOUNCE_INTERVAL = 500;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
    }
  };
})();
