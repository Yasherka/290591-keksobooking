'use strict';

(function () {
  window.synchronizeFields = function (element1, element2, value1, value2, sync) {
    element1.addEventListener('change', function () {
      var index = value1.indexOf(element1.value);
      sync(element2, value2[index]);
    });
  };
})();
